import { ID } from 'core/scalars';
import { gql } from 'apollo-server-express';

export const userTypeDef = gql`
  type User {
    id: ID!
  }
`;

/**
 * Dummy model for a user, not really used since there is no real authentication
 */
export class User {
  id: ID;
  // ...
  // Rest of common user fields
}
