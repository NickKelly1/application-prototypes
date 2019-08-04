import { ThreadEntity } from '../models/thread-entity';

export class ThreadTable {
  public rows: Map<ThreadEntity['id'], ThreadEntity> = new Map([]);
}
