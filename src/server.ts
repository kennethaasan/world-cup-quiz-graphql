import { ApolloServer } from 'apollo-server';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

const server = new ApolloServer({ typeDefs, resolvers, introspection: true });

server.listen().then(({ url }) => {
  // tslint:disable-next-line no-console
  console.log(`🚀  Server ready at ${url}`);
});
