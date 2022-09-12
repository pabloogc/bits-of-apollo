import { gql } from 'apollo-server-express';

export const showTypeDef = gql`
  enum ShowState {
    NOT_STARTED
    IN_PROGRESS
    COMPLETED
  }

  type Show {
    id: ID!
    ownerID: ID!
    owner: User!
    state: ShowState
    products: [Product!]
    auctions: [Auction!]
  }

  extend type Query {
    shows: [Show!]
  }

  input AddProductToShowInput {
    showID: ID!
    name: String!
  }

  extend type Mutation {
    createShow: Show
    addProductToShow(input: AddProductToShowInput!): Show
    startShow(showID: ID!): Show
    completeShow(showID: ID!): Show
  }
`;
