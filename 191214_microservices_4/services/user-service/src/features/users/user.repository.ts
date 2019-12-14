import { uuidv4 } from '@syntaxfanatics/peon';
import { Injectable } from '@nestjs/common';
import { UserModel, UserId, UserAttributes } from './user.model';
import { WithId } from '../../@types/with-id';
import { classLogger } from '../../helpers/logger';


@Injectable()
export class UserRepository {
  readonly logger = classLogger(this);
  readonly items: Map<UserId, UserModel> = new Map();

  constructor() {
    this.logger.dInfo('constructor');
  }

  async create(attr: UserAttributes): Promise<UserModel> {
    this.logger.dInfo('create', attr);
    if (Array.from(this.items.values()).find((item) => item.attr.email === attr.email)) {
      throw new ReferenceError(`Item with email "${attr.email}" already exists`);
    }
    const newId = uuidv4();
    const newItem = new UserModel(newId, attr);
    this.items.set(newId, newItem);
    return newItem;
  }

  async findOneById(id: UserId): Promise<undefined | UserModel> {
    this.logger.dInfo('findOneById', id);
    const item = this.items.get(id);
    return item;
  }

  async findAndFailById(id: UserId): Promise<UserModel> {
    this.logger.dInfo('findAndFailbyId', id);
    const item = this.items.get(id);
    if (!item) throw new ReferenceError(`Failed to find item "${id}"`);
    return item;
  }

  async findAndUpdateById(id: UserId, attr: Partial<UserAttributes>) {
    this.logger.dInfo('findAndUpdateById', id);
  }

  // async find

  async find(): Promise<UserModel[]> {
    this.logger.dInfo('find');
    const items = Array.from(this.items.values());
    return items;
  }
}
