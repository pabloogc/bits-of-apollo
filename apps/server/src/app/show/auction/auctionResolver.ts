import {ID} from "core/scalars";
import {Show} from "app/show/show/show";
import {Container} from "typedi";
import {AuctionService} from "app/show/auction/auctionService";

export const auctionResolver = {
  Mutation: {
    startAuction(_, args: { input: { showID: ID, productID: ID } }): Promise<Show | undefined> {
      const service = Container.get(AuctionService);
      throw "TODO";
    },
  },
};
