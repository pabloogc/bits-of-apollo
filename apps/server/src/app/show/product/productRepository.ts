import {InMemoryRepository} from "core/inMemoryRepository";
import {Service} from "typedi";
import {Product} from "app/show/product/product";

// see ShowRepository
@Service()
export class ProductRepository extends InMemoryRepository<Product> {
}
