import { gql } from 'apollo-server';
import { IQuestion, QuestionTypeDefs } from './Question';

export interface IUser {
  id: number;
  name: string;
  points: number;
  questions: IQuestion[];
}

export const UserTypeDefs = gql`
  ${QuestionTypeDefs}

  type User {
    id: ID!
    name: String!
    points: Int!
    questions: [Question!]!
  }
`;
