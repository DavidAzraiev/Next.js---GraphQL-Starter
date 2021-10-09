import 'reflect-metadata';
import { createSchema } from './utils/createSchema';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { createConnection } from 'typeorm';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { redis } from './redis';
import cors from 'cors';
import queryComplexity, {
  simpleEstimator,
  fieldExtensionsEstimator,
} from 'graphql-query-complexity';

const main = async () => {
  await createConnection();

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
    validationRules: [
      queryComplexity({
        maximumComplexity: 20,
        variables: {},
        onComplete: (complexity: number) => {
          console.log('Query Complexity: ', complexity);
        },
        estimators: [
          fieldExtensionsEstimator(),
          simpleEstimator({
            defaultComplexity: 1,
          }),
        ],
      }) as any,
    ],
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})], //OLD GRAPHQL PLAYGROUND
  });

  const app = express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000',
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis,
      }),
      name: 'qid',
      secret: 'dfkijdsfkjdknrfn39uyigj',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 3, // 3Day
      },
    })
  );

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('server started on localhost:4000/graphql');
  });
};

main();
