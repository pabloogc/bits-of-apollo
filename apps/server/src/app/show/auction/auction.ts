import {gql} from "apollo-server";
import {ID} from "core/scalars";
import {User} from "app/user/user";

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

  extend type Subscription  {
    auctionUpdated(auctionID: ID!): Auction
  }
`;

export enum AuctionState {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface StartAuctionInput {
  showID: ID;
  productID: ID;
  startingBid: number;
}

export interface BidAuctionInput {
  user: User,
  auctionID: ID;
  bid: number;
}

export interface Auction {
  id: ID;
  showID: ID;
  productID: ID;
  highestBidderID: ID | undefined;
  currentBid: number;
  finishesAt: string;
  state: AuctionState;
}
