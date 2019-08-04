import * as ioTs from 'io-ts';
import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import { ValidationReporter } from '../../validation/helpers/validation-reporter';
import { UserAttributesCodec, UserRecordCodec, UserRecord, UserAttributes } from '../codecs/user-codecs';
import { UserModel } from '../models/users/user-model';

export class UserRepository {
  private attributesCodec = UserAttributesCodec;
  private codec = UserRecordCodec;

  public records: Map<UserRecord['id'], UserRecord> = new Map([]);
  public nextId: UserRecord['id'];

  /**
   * @constructor
   */
  public constructor() {
    this.nextId = 1;
  }

  /**
   * @description
   * Map UserRecord (from Repository) to UserModel
   *
   * @param record
   */
  public recordToUser = (record: UserRecord): UserModel => {
    const { id, ...attributes } = record;
    const user = new UserModel(id, attributes, this);
    return user;
  };

  /**
   * @description
   * Map UserModel to UserRecord (for repository)
   *
   * @param user
   */
  public userToRecord = (user: UserModel): UserRecord => {
    const { id, attributes } = user;
    const record = { ...attributes, id };
    return record;
  };

  /**
   * @description
   * Create a record in the table
   *
   * @param inputAttributes
   */
  public create = async (inputAttributes: UserAttributes): Promise<Either<Error, UserModel>> => {
    const attributes = this.attributesCodec.decode(inputAttributes);

    // attribute validation failed?
    if (isLeft(attributes)) return left(Error(ValidationReporter.stringify(ValidationReporter.report(attributes))));

    const id = this.nextId;
    const newRecord = { ...attributes.right, id: id };
    this.records.set(id, newRecord);
    this.nextId++;

    // map record to user
    return right(this.recordToUser(newRecord));
  };

  /**
   * @description
   * Update a record in the table
   *
   * @param id
   * @param inputAttributes
   */
  public update = async (id: UserRecord['id'], inputAttributes: UserAttributes): Promise<Either<Error, UserModel>> => {
    const attributes = this.attributesCodec.decode(inputAttributes);

    // attribute validation failed?
    if (isLeft(attributes)) return left(Error(ValidationReporter.stringify(ValidationReporter.report(attributes))));

    const record = this.records.get(id);

    // record not found?
    if (record === undefined) return left(Error(`Record "${id}" could not be found`));

    const updatedRecord = { ...record, ...attributes.right, id };
    this.records.set(id, updatedRecord);

    return right(this.recordToUser(updatedRecord));
  };

  /**
   * @description
   * Deleted a record
   *
   * @param id
   */
  public delete = async (id: UserRecord['id']): Promise<Either<false, true>> => {
    const wasDeleted = this.records.delete(id);
    if (!wasDeleted) return left(wasDeleted);
    return right(wasDeleted);
  };
}
