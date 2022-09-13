import { ID } from 'core/scalars';
import { User } from 'app/auth/user';

export enum AuctionState {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

// GraphQL Types

export interface StartAuctionInput {
  showID: ID;
  productID: ID;
  startingBid: number;
}

export interface BidAuctionInput {
  user: User;
  auctionID: ID;
  bid: number;
}

// Entity

export interface Auction {
  id: ID;
  showID: ID;
  productID: ID;
  highestBidderID: ID | undefined;
  currentBid: number;
  finishesAt: string;
  state: AuctionState;
}
