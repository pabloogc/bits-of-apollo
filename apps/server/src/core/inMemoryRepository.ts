import { Service } from 'typedi';

/**
 * Dumb and simple in-memory repository for the different models of this sample.
 */
@Service()
export class InMemoryRepository<T extends { id: string }> {
  private ids = 0;
  private items = new Map<string, T>();

  async getAll(): Promise<T[]> {
    return [...this.items.values()];
  }

  async findOneOrFail(id: string): Promise<T> {
    const out = await this.findOne(id);
    if (out === undefined) throw new Error(`Item with id ${id} not found`);
    return out;
  }

  async findOne(id): Promise<T | undefined> {
    return this.items.get(id);
  }

  async findBy(predicate: (item: T) => boolean): Promise<T[]> {
    return (await this.getAll()).filter(predicate);
  }

  async insert(newItem: Omit<T, 'id'>): Promise<T> {
    const toInsert = { ...newItem, id: `${this.ids++}` } as T;
    this.items.set(toInsert.id, toInsert);
    return toInsert;
  }

  async update(id: string, toUpdate: Partial<T>): Promise<T | undefined> {
    const current = this.items.get(id);
    if (current) {
      const updated = { ...current, ...toUpdate, id: id };
      this.items.set(id, updated);
      return updated;
    }
  }

  async updateOrFail(id: string, toUpdate: Partial<T>): Promise<T> {
    const updated = await this.update(id, toUpdate);
    if (updated === undefined)
      throw new Error(`Item with id ${id} not updated`);
    return updated;
  }
}
