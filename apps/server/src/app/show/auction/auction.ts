import {gql} from "apollo-server";
import {ID} from "core/scalars";

export const auctionTypeDef = gql`

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
    showID: ID!
    productId: ID!
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
`;

enum AuctionState {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface Auction {
  id: ID;
  showID: ID;
  productID: ID;
  highestBidderID: ID;
  currentBid: number;
  finishesAt: string;
  state: AuctionState;
}
