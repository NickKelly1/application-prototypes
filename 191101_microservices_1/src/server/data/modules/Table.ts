import { uuidv4 } from '../../../shared/helpers/uuidv4';

export class Table<T extends { id?: string }> {
  rows: Map<string, T> = new Map();

  /**
   * @description
   * Retrieve records
   */
  select() { return this.rows; }

  /**
   * Create a new record
   *
   * @param body
   */
  insert(body: T) {
    if ('id' in body && typeof body.id === 'string') {
      const { id } = body;
      throw new ReferenceError(`id ${id} Already exists`);
    }

    const id = uuidv4();
    body.id = id;
    this.rows.set(id, body);
  }

  /**
   * Create or update a record
   *
   * @param body
   */
  update(body: T) {
    // new?
    if (!('id' in body) || typeof body.id !== 'string') return this.insert(body);

    // exists?
    const { id } = body;
    const match = this.rows.get(id);

    // no
    if (!match) throw new ReferenceError(`id ${id} does not exist`);

    // yes
    Object.assign(match, body);
    this.rows.set(id, match);
  }
}