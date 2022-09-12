import { Service } from 'typedi';
import {
  Auction,
  AuctionState,
  BidAuctionInput,
  StartAuctionInput,
} from 'app/show/auction/auction';
import { AuctionRepository } from 'app/show/auction/auctionRepository';
import { ShowRepository } from 'app/show/show/showRepository';
import { ProductRepository } from 'app/show/product/productRepository';
import { cancelJob, scheduleJob } from 'node-schedule';
import { NotificationService } from 'app/notification/notificationService';

const AUCTION_DEFAULT_DURATION = 60_000;
const AUCTION_BID_EXTRA_TIME = 15_000;

@Service()
export class AuctionService {
  constructor(
    private readonly showRepository: ShowRepository,
    private readonly productRepository: ProductRepository,
    private readonly auctionRepository: AuctionRepository,
    private readonly notificationService: NotificationService
  ) {}

  async startAuction(input: StartAuctionInput) {
    const finishDate = new Date(Date.now() + AUCTION_DEFAULT_DURATION);
    const auction = await this.auctionRepository.insert({
      currentBid: input.startingBid,
      finishesAt: finishDate.toISOString(),
      highestBidderID: undefined,
      productID: input.productID,
      showID: input.showID,
      state: AuctionState.IN_PROGRESS,
    });

    this.scheduleAuctionCompletion(auction, finishDate);

    return auction;
  }

  async bidToAuction(input: BidAuctionInput): Promise<Auction | undefined> {
    const auction = await this.auctionRepository.findOneOrFail(input.auctionID);

    if (
      auction.currentBid >= input.bid ||
      auction.state === AuctionState.COMPLETED
    ) {
      return auction; //Nothing to do
    }

    // Check if we need to push the end time
    const finishDate = new Date(auction.finishesAt);
    const remaining = Date.now() - finishDate.getTime();
    if (remaining < AUCTION_BID_EXTRA_TIME) {
      finishDate.setTime(finishDate.getTime() + AUCTION_BID_EXTRA_TIME);
      this.scheduleAuctionCompletion(auction, finishDate);
    }

    const updated = await this.auctionRepository.updateOrFail(auction.id, {
      currentBid: input.bid,
      highestBidderID: input.user.id,
      finishesAt: finishDate.toISOString(),
    });
    await this.notificationService.notifyAuctionUpdated(updated);
    return updated;
  }

  private scheduleAuctionCompletion(auction: Auction, finishAt: Date) {
    const job = `auction:${auction.id}`;
    cancelJob(job); // Cancel any already scheduled jobs
    scheduleJob(job, finishAt, async () => {
      const updatedAuction = await this.auctionRepository.updateOrFail(
        auction.id,
        { state: AuctionState.COMPLETED }
      );
      await this.notificationService.notifyAuctionUpdated(updatedAuction);
    });
  }
}
