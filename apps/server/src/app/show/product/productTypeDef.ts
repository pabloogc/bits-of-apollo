import { gql } from 'apollo-server-express';

export const productTypeDef = gql`
  type Product {
    id: ID!
    name: String!
  }
`;
