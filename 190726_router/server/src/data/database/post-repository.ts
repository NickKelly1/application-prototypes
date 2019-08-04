import { PostEntity } from '../models/post-entity';

export class PostsTable {
  public rows: Map<PostEntity['id'], PostEntity> = new Map([]);
}
