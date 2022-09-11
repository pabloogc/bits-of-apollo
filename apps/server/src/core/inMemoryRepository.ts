import {Service} from "typedi";

/**
 * Dumb and simple in-memory repository for different models.
 */
@Service()
export class InMemoryRepository<T extends { id: string }> {
  private items = new Map<string, T>();

  async getAll(): Promise<T[]> {
    return [...this.items.values()];
  }

  async findOneOrFail(id: string): Promise<T> {
    const out = await this.findOne(id);
    if (out === undefined) throw new Error(`Item with ${id} not found`);
    return out;
  }

  async findOne(id): Promise<T | undefined> {
    return this.items.get(id);
  }

  async findBy(predicate: (item: T) => boolean): Promise<T[]> {
    return (await this.getAll()).filter(predicate);
  }

  async insert(newItem: Omit<T, "id">): Promise<T> {
    const toInsert = {...newItem, id: `${this.items.size}`} as T;
    this.items.set(toInsert.id, toInsert);
    return toInsert;
  }

  async update(id: string, toUpdate: Partial<T>): Promise<T | undefined> {
    const current = this.items.get(id);
    if (current) {
      const updated = {...current, ...toUpdate, id: id};
      this.items.set(id, updated);
      return updated;
    }
  }
}
