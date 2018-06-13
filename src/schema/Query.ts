import { gql } from 'apollo-server';
import { getUser, getUsers } from '../google';
import { IUser, UserTypeDefs } from './User';

export const QueryTypeDefs = gql`
  ${UserTypeDefs}

  type Query {
    users: [User!]!
    user(user_id: ID!): User
  }
`;

export const QueryResolvers = {
  Query: {
    users: (): Promise<IUser[] | void> => {
      return getUsers();
    },
    user: (_: any, args: { user_id: string }): Promise<IUser | void> => {
      return getUser(parseInt(args.user_id, 10));
    },
  },
};
