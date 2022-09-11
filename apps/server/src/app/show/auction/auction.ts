import {gql} from "apollo-server";
import {ID} from "core/scalars";
import {Product} from "app/show/product/product";
import {User} from "app/user/user";

export const auctionTypeDef = gql`
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

  extend type Mutation {
    startProductAuction(showID: ID!, productID: ID!): Show
    bidToAuction(auctionID: ID!): Auction
  }
`;

enum AuctionState {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface Auction {
  id: ID;
  productID: ID;
  product: Product;
  highestBidderID: ID;
  highestBidder: User;
  currentBid: number;
  finishesAt: string;
  state: AuctionState;
}
