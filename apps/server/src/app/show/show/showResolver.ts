import {Show, ShowState} from "app/show/show/show";
import {Container} from "typedi";
import {ID} from "core/scalars";
import {Product} from "app/show/product/product";
import {User} from "app/user/user";
import {ShowService} from "app/show/show/showService";
import {RequestContext} from "core/requestContext";

export const showResolver = {
  Query: {
    async shows(): Promise<Show[]> {
      const service = Container.get(ShowService);
      return service.getAllShows();
    },
  },

  Mutation: {
    async createShow(parent, args, context: RequestContext): Promise<Show> {
      const service = Container.get(ShowService);
      return service.createShow(context.user);
    },

    async addProductToShow(_, args: { input: { showID: ID, name: string } }): Promise<Show | undefined> {
      const service = Container.get(ShowService);
      await service.addProduct(args.input.showID, {name: args.input.name, showID: args.input.showID});
      return service.getShow(args.input.showID);
    },

    async startShow(_, args: { showID: ID }): Promise<Show | undefined> {
      const service = Container.get(ShowService);
      return service.updateShow(args.showID, {state: ShowState.IN_PROGRESS});
    },

    async completeShow(_, args: { showID: ID }): Promise<Show | undefined> {
      const service = Container.get(ShowService);
      return service.updateShow(args.showID, {state: ShowState.COMPLETED});
    },
  },

  Show: {
    owner(parent: Show): User {
      // Resolving a user is quite dumb here since they
      // don't have any extra data, but here it's
      // where a query to the proper userService would happen
      return {
        id: parent.ownerID,
      };
    },

    async products(parent: Show): Promise<Product[]> {
      const service = Container.get(ShowService);
      return service.getProductsFromShow(parent.id);
    },
  },
};
