import { Service } from 'typedi';
import { Auction } from 'app/show/auction/auction';
import { PubSub } from 'graphql-subscriptions';

@Service()
export class NotificationService {
  private readonly pubsub = new PubSub();

  async notifyAuctionUpdated(auction: Auction) {
    await this.pubsub.publish('AUCTION_UPDATED', auction);
  }

  auctionsStream(): AsyncIterator<Auction> {
    return this.pubsub.asyncIterator('AUCTION_UPDATED');
  }
}
