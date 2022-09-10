import {gql} from "apollo-server";

export const schema = gql`
  type User {
    id: ID!
  }

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
    products: [Product!]! # The products being actioned
    auctions: [Auction!]!
  }

  input CreateShowInput {
    products: [ProductInput!]!
    startsAt: String
  }

  # Products

  type Product {
    id: ID!
    name: String!
  }

  input ProductInput {
    name: String
  }

  # Auctions

  enum AuctionState {
    NOT_STARTED
    IN_PROGRESS
    COMPLETED
  }

  type Auction {
    id: ID!
    productID: ID!
    product: Product!
    highestBidderID: ID!
    highestBidder: User
    currentBid: Int
    finishesAt: String
    state: AuctionState
  }

  input StartAuctionInput {
    productId: ID!
    startingBig: Int!
  }

  # Mutations and queries

  type Mutation {
    createShow: Show
    addProductToShow(showId: ID!, product: ProductInput!): Show
    startAuction(showID: ID!, auctionInput: StartAuctionInput): Show
    startShow(showID: ID!): Show
    completeShow(showID: ID!): Show
    startProductAuction(showID: ID!, productID: ID!): Show

    # Bidding
    bidToAuction(auctionID: ID!): Auction
  }

  type Query {
    shows: [Show!]!
  }

  type Subscription {
    showUpdated(showID: ID!): Show
  }
`;
