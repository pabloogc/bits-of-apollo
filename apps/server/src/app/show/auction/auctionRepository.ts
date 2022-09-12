import { InMemoryRepository } from 'core/inMemoryRepository';
import { Service } from 'typedi';
import { Auction } from 'app/show/auction/auction';

// see ShowRepository
@Service()
export class AuctionRepository extends InMemoryRepository<Auction> {}
