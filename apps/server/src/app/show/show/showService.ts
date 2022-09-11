import {Service} from "typedi";
import {Show, ShowState} from "app/show/show/show";

@Service()
export class ShowService {

  async getAllShows(): Promise<Show[]> {
    const x: Show = {
      auctions: [],
      owner: undefined as never,
      state: ShowState.COMPLETED,
      ownerID: "1234",
      products: [],
      id: "123",
    };
    return [x];
  }
}


