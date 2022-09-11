import {Service} from "typedi";
import {Show, ShowState} from "app/show/show/show";
import {User} from "app/user/user";
import {pubsub} from "core/pubsub";
import {ID} from "core/scalars";
import {InMemoryRepository} from "core/inMemoryRepository";
import {Product} from "app/show/product/product";

export enum ShowEvents {
  SHOW_UPDATED = "SHOW_UPDATED"
}

@Service()
export class ShowService {

  private readonly showRepository = new InMemoryRepository<Show>();
  private readonly productRepository = new InMemoryRepository<Product>();
  private readonly auctionRepository = new InMemoryRepository<Product>();

  async getAllShows(): Promise<Show[]> {
    return this.showRepository.getAll();
  }

  async getShow(showId: ID) {
    return this.showRepository.findOne(showId);
  }

  async getProductsFromShow(showID: ID): Promise<Product[]> {
    return this.productRepository.findBy(it => it.showID == showID);
  }

  async createShow(owner: User): Promise<Show> {
    const newShow = {
      owner: owner,
      ownerID: owner.id,
      state: ShowState.NOT_STARTED,
      auctions: [],
      products: [],
    };
    return this.showRepository.insert(newShow);
  }

  async updateShow(id: ID, newShow: Partial<Show>): Promise<Show | undefined> {
    const updated = await this.showRepository.update(id, newShow);
    if (updated) {
      await pubsub.publish(ShowEvents.SHOW_UPDATED, updated);
    }
    return updated;
  }

  async addProduct(showId: ID, product: Omit<Product, "id">): Promise<Product | undefined> {
    await this.showRepository.findOneOrFail(showId);
    return await this.productRepository.insert(product);
  }

}


