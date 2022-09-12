import { gql } from 'apollo-server-express';

export const baseTypeDef = gql`
  # Empty types extended by the other files
  type Query {
    _empty: Int # types can't be emtpy
  }
  type Mutation {
    _empty: Int
  }
  type Subscription {
    _empty: Int
  }
`;
