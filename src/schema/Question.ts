import { gql } from 'apollo-server';

export interface IQuestion {
  question: string;
  answer: string;
  blueprint: string | void;
  points: number | void;
}

export const QuestionTypeDefs = gql`
  type Question {
    question: String!
    answer: String!
    blueprint: String
    points: Int
  }
`;
