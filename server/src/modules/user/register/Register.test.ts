import { gCall } from './../../../test-utils/gCall';
import { graphql } from 'graphql';
import { Connection } from 'typeorm';
import { testConn } from './../../../test-utils/testConn';

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

const registerMutation = `
mutation Register($data: RegisterInput!) {
  register(
    data: $data
  ) {
    firstName
    lastName
    email
    id
    name
  }
}

`;

describe('Register', () => {
  it('create user', async () => {
    console.log(
      await gCall({
        source: registerMutation,
        variableValues: {
          data: {
            firstName: 'david',
            lastName: 'david',
            email: 'david20@test.com',
            password: 'david',
          },
        },
      })
    );
  });
});
