import {ID} from "core/scalars";
import {gql} from "apollo-server";

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

  input CreateShowInput {
    products: [ProductInput!]!
    startsAt: String
  }

  extend type Query {
    shows: [Show!]
  }

  extend type Mutation {
    createShow: Show
    addProductToShow(showID: ID!, product: ProductInput!): Show
    startAuction(showID: ID!, auctionInput: StartAuctionInput): Show
    startShow(showID: ID!): Show
    completeShow(showID: ID!): Show
  }

  extend type Subscription {
    showUpdated(showID: ID!): Show
  }
`;

export enum ShowState {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface Show {
  id: ID;
  ownerID: ID;
  state: ShowState;
}
