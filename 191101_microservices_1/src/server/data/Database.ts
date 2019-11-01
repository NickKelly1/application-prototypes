import { ORDER } from '../../shared/domains/orders/ORDER_CODEC';
import { Table } from './modules/Table';

export class Database {
  orders: Table<ORDER>

  constructor() {
    this.orders = new Table();
  }
}
