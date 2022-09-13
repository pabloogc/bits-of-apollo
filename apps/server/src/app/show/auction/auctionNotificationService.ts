import { Service } from 'typedi';
import { Auction } from 'app/show/auction/auction';
import { PubSub } from 'graphql-subscriptions';

@Service()
export class AuctionNotificationService {
  /**
   * Ideally this should be injected for easy testing
   */
  private readonly pubsub = new PubSub();

  async notifyAuctionUpdated(auction: Auction) {
    await this.pubsub.publish('AUCTION_UPDATED', auction);
  }

  auctionsUpdatedStream(): AsyncIterator<Auction> {
    return this.pubsub.asyncIterator('AUCTION_UPDATED');
  }
}
