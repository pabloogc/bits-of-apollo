import {Show} from "app/show/show/show";
import {Container} from "typedi";
import {ID} from "core/scalars";
import {ProductInput} from "app/show/product/product";
import {User} from "app/user/user";
import {ShowService} from "app/show/show/showService";

export const showResolver = {
  Query: {
    async shows(): Promise<Show[]> {
      const service = Container.get(ShowService);
      return service.getAllShows();
    },
  },

  Mutation: {
    createShow(): Show {
      throw "TODO";
    },

    addProductToShow(showId: ID, product: ProductInput): Show {
      throw "TODO";
    },

    startShow(showID: ID): Show {
      throw "TODO";
    },

    completeShow(showID: ID): Show {
      throw "TODO";
    },

    startProductAuction(showID: ID, productID: ID): Show {
      throw "TODO";
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
  },
};
