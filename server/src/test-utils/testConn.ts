import { createConnection } from 'typeorm';

export const testConn = (drop: boolean = false) => {
  return createConnection({
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'david',
    password: 'david',
    database: 'next-graphql-starter-test',
    synchronize: true,
    dropSchema: drop,
    entities: [__dirname + '/../entity/*.*'],
  });
};
