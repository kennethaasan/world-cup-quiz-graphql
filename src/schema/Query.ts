import { gql } from 'apollo-server';
import { getGoogleSheetsData } from '../google';
import { getPoints } from '../utils';
import { IUser, UserTypeDefs } from './User';

export const QueryTypeDefs = gql`
  ${UserTypeDefs}

  type Query {
    users: [User!]!
  }
`;

export const QueryResolvers = {
  Query: {
    users: async (): Promise<IUser[] | void> => {
      const googleSheetsData = await getGoogleSheetsData();

      const [headers, blueprints, ...users] = googleSheetsData;

      return users
        .map(user => {
          const [timestamp, email, name, ...rest] = user;

          let points: number = 0;

          const questions = rest.map((answer, index) => {
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
    },
  },
};
