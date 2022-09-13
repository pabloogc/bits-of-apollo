import { ID } from 'core/scalars';
import { Container } from 'typedi';
import { AuctionService } from 'app/show/auction/auctionService';
import {
  Auction,
  BidAuctionInput,
  StartAuctionInput,
} from 'app/show/auction/auction';
import { RequestContext } from 'core/requestContext';
import { withFilter } from 'graphql-subscriptions';
import { AuctionNotificationService } from 'app/show/auction/auctionNotificationService';

export const auctionResolver = {
  Mutation: {
    async startAuction(
      _,
      args: { input: StartAuctionInput }
    ): Promise<Auction | undefined> {
      const service = Container.get(AuctionService);
      return await service.startAuction(args.input);
    },

    async bidToAuction(
      _,
      args: { input: BidAuctionInput },
      context: RequestContext
    ): Promise<Auction | undefined> {
      const service = Container.get(AuctionService);
      return service.bidToAuction({
        user: context.user,
        auctionID: args.input.auctionID,
        bid: args.input.bid,
      });
    },
  },

  Subscription: {
    auctionUpdated: {
      subscribe: withFilter(
        () => Container.get(AuctionNotificationService).auctionsUpdatedStream(),
        (payload: Auction, variables: { auctionID: ID }) => {
          return payload.id === variables.auctionID;
        }
      ),
      resolve: (payload) => payload, // The body is the auction itself, so just return it
    },
  },
};
