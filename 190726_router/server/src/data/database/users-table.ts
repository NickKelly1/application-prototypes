import { UserEntity } from '../entities/user-entity';

export class UsersTable {
  public rows: Map<UserEntity['id'], UserEntity> = new Map([]);
}
