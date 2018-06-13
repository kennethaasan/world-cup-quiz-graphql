import { gql } from 'apollo-server';
import { IQuestion, QuestionTypeDefs } from './Question';

export interface IUser {
  name: string;
  questions: IQuestion[];
}

export const UserTypeDefs = gql`
  ${QuestionTypeDefs}

  type User {
    name: String!
    points: Int!
    questions: [Question!]!
  }
`;
