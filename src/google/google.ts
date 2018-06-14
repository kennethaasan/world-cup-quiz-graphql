import { HttpsAgent } from 'agentkeepalive';
import retry from 'async-retry';
import fetch from 'node-fetch';
import { getEnviromentVariable, getPoints } from '../utils';

const fetchOptions = {
  agent: new HttpsAgent({
    maxSockets: 1000,
    maxFreeSockets: 256,
  }),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'user-agent': 'graphql',
  },
  timeout: 10000,
};

const GOOGLE_API_KEY = getEnviromentVariable('GOOGLE_API_KEY');
const GOOGLE_SHEETS_ID = '1ATa8bq1wIlezGCWT3ioStbZP6ANBBY7JCAe_AO5Cya0';
const GOOGLE_SHEETS_RANGE = 'A1%3ABO35';

async function getGoogleSheetsData(): Promise<string[][]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/${GOOGLE_SHEETS_RANGE}?key=${GOOGLE_API_KEY}`;
  const json = await retry(
    async () => {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(
          `Google Sheets request ${url} failed with status: ${
            response.status
          } with this status text: ${response.statusText}`
        );
      }

      return response.json();
    },
    {
      retries: 10,
      factor: 2,
      minTimeout: 100,
      maxTimeout: 5000,
    }
  );

  if (!json || !json.values || !Array.isArray(json.values)) {
    throw new Error(
      `Google Sheets ${url} responds with: ${JSON.stringify(json)}`
    );
  }

  return json.values;
}

export async function getUsers() {
  const googleSheetsData = await getGoogleSheetsData();

  const [headers, blueprints, ...users] = googleSheetsData;

  return users
    .map((user, index) => {
      const [timestamp, email, name, ...rest] = user;

      let points: number = 0;

      const questions = rest.map(answer => {
        const question = headers[index + 3];
        const blueprint = blueprints[index + 3];

        const questionPoints = getPoints(question, answer, blueprint);

        if (questionPoints) {
          points = points + questionPoints;
        }

        return {
          question,
          answer,
          blueprint: blueprint === '' ? undefined : blueprint,
          points: questionPoints,
        };
      });

      return {
        id: index + 1,
        timestamp,
        email,
        name,
        points,
        questions,
      };
    })
    .sort((a, b) => {
      if (a.points === b.points) {
        return a.name.localeCompare(b.name);
      } else if (a.points > b.points) {
        return -1;
      } else if (a.points < b.points) {
        return 1;
      }
      return 0;
    });
}

export async function getUser(userId: number) {
  const users = await getUsers();
  return users.find(user => user.id === userId);
}
