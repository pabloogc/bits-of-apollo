import { ID } from 'core/scalars';
import { gql } from 'apollo-server-express';

export const userTypeDef = gql`
  type User {
    id: ID!
  }
`;

export class User {
  id: ID;
  // ...
  // Rest of common user fields
}
