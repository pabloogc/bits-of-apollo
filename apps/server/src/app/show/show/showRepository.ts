import { InMemoryRepository } from 'core/inMemoryRepository';
import { Show } from 'app/show/show/show';
import { Service } from 'typedi';

// Inheritance is a bit ugly, this is a workaround to keep
// dependency injection clean as it would look like in a real scenario
// where this repository actually does something instead of being a empty class
@Service()
export class ShowRepository extends InMemoryRepository<Show> {}
