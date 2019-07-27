import { ThreadEntity } from '../entities/thread-entity';

export class ThreadTable {
  public rows: Map<ThreadEntity['id'], ThreadEntity> = new Map([]);
}
