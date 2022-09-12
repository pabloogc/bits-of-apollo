import { gql } from 'apollo-server-express';

export const auctionTypeDef = gql`
  enum AuctionState {
    IN_PROGRESS
    COMPLETED
  }

  type Auction {
    id: ID!
    productID: ID!
    product: Product!
    highestBidderID: ID
    highestBidder: User
    currentBid: Int
    finishesAt: String
    state: AuctionState
  }

  input StartAuctionInput {
    showID: ID!
    productID: ID!
    startingBid: Int!
  }

  input BidAuctionInput {
    auctionID: ID!
    bid: Int!
  }

  extend type Mutation {
    startAuction(input: StartAuctionInput!): Show
    bidToAuction(input: BidAuctionInput!): Auction
  }

  extend type Subscription {
    auctionUpdated(auctionID: ID!): Auction
  }
`;
