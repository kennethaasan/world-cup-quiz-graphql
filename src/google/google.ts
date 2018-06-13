import { HttpsAgent } from 'agentkeepalive';
import retry from 'async-retry';
import fetch from 'node-fetch';
import { getEnviromentVariable } from '../utils';

const agent = new HttpsAgent({
  maxSockets: 1000,
  maxFreeSockets: 256,
});
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'user-agent': 'graphql',
};
const timeout = 10000;
const fetchOptions = {
  agent,
  headers,
  timeout,
};

const GOOGLE_API_KEY = getEnviromentVariable('GOOGLE_API_KEY');
const GOOGLE_SHEETS_ID = '1ATa8bq1wIlezGCWT3ioStbZP6ANBBY7JCAe_AO5Cya0';
const GOOGLE_SHEETS_RANGE = 'A1%3ABO23';

export async function getGoogleSheetsData(): Promise<string[][]> {
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
