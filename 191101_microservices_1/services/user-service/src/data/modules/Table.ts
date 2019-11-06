
export class Table<T extends { id?: number }> {
  rows: Map<number, T> = new Map();
  private nextInc = 1;

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
    if ('id' in body && typeof body.id === 'number') {
      const { id } = body;
      throw new ReferenceError(`id ${id} Already exists`);
    }

    const nextId = this.nextInc;
    this.nextInc += 1;

    body.id = nextId;
    this.rows.set(nextId, body);
  }

  /**
   * Create or update a record
   *
   * @param body
   */
  update(body: T) {
    // new?
    if (!('id' in body) || typeof body.id !== 'number') return this.insert(body);

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