import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { createConnection } from 'typeorm';
import { RegisterResolver } from './modules/user/Register';

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [RegisterResolver],
  });

  const apolloServer = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})], //OLD GRAPHQL PLAYGROUND
  });

  const app = express();

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('server started on localhost:4000/graphql');
  });
};

main();
