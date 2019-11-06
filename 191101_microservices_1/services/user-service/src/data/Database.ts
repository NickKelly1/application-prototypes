import { Table } from './modules/Table';

export class Database<T> {
  orders: Table<T>;

  constructor() {
    this.orders = new Table();
  }
}
