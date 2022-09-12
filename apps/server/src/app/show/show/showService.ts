import { Service } from 'typedi';
import { Show, ShowState } from 'app/show/show/show';
import { User } from 'app/auth/user';
import { ID } from 'core/scalars';
import { Product } from 'app/show/product/product';
import { ProductRepository } from 'app/show/product/productRepository';
import { ShowRepository } from 'app/show/show/showRepository';
import { AuctionRepository } from 'app/show/auction/auctionRepository';
import { Auction } from 'app/show/auction/auction';

@Service()
export class ShowService {
  constructor(
    private readonly showRepository: ShowRepository,
    private readonly productRepository: ProductRepository,
    private readonly auctionRepository: AuctionRepository
  ) {}

  async getAllShows(): Promise<Show[]> {
    return this.showRepository.getAll();
  }

  async getShow(showId: ID) {
    return this.showRepository.findOne(showId);
  }

  async getProductsFromShow(showID: ID): Promise<Product[]> {
    return this.productRepository.findBy((it) => it.showID == showID);
  }

  async getAuctionsFromShow(showID: ID): Promise<Auction[]> {
    return this.auctionRepository.findBy((it) => it.showID == showID);
  }

  async createShow(owner: User): Promise<Show> {
    const newShow = {
      owner: owner,
      ownerID: owner.id,
      state: ShowState.NOT_STARTED,
    };
    return this.showRepository.insert(newShow);
  }

  async updateShow(id: ID, newShow: Partial<Show>): Promise<Show | undefined> {
    return await this.showRepository.update(id, newShow);
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<Product | undefined> {
    await this.showRepository.findOneOrFail(product.showID);
    return await this.productRepository.insert(product);
  }
}
