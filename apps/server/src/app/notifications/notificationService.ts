import {Service} from "typedi";
import {Auction} from "app/show/auction/auction";
import {pubsub} from "core/pubsub";

@Service()
export class NotificationService {

  async notifyAuctionUpdated(auction: Auction) {
    await pubsub.publish("AUCTION_UPDATED", auction);
  }
}
