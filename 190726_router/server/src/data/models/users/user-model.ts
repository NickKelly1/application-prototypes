import * as ioTs from 'io-ts';
import { UserAttributesCodec, UserAttributes, UserRecord } from '../../codecs/user-codecs';
import { ValidationReporter } from '../../../validation/helpers/validation-reporter';
import { isLeft, Either, left, right } from 'fp-ts/lib/Either';
import { UserRepository } from '../../database/user-repository';

// https://github.com/gcanti/io-ts

/**
 * User Class
 */
export class UserModel {
  private static attributesCodec = UserAttributesCodec;

  public readonly id: number;
  public oldAttributes: UserAttributes;
  public attributes: UserAttributes;
  private repository: UserRepository;

  private _isDeleted = false;

  public get isDeleted() {
    return this._isDeleted;
  }

  /**
   * @constructor
   *
   * @param id
   * @param attributes
   * @param repository
   */
  public constructor(id: UserRecord['id'], attributes: UserAttributes, repository: UserRepository) {
    this.id = id;
    this.oldAttributes = { ...attributes };
    this.attributes = { ...attributes };
    this.repository = repository;
  }

  /**
   * @description
   * Save the updated record to the repository
   */
  public update = async (): Promise<Either<Error, ThisType<UserModel>>> => {
    if (this.isDeleted) return left(new Error(`Unable to update User "${this.id}". User is deleted.`));

    const updateOperation = await this.repository.update(this.id, this.attributes);
    if (isLeft(updateOperation)) return left(new Error(`Unable to update User "${this.id}". ${updateOperation.left}`));

    // refresh record
    const updatedRecord = updateOperation.right;
    this.oldAttributes = this.attributes;

    const { id, ...newAttributes } = updatedRecord;
    this.attributes = newAttributes;
    return right(this);
  };

  /**
   * @description
   * Delete the user from the repository
   */
  public delete = async (): Promise<Either<Error, ThisType<UserModel>>> => {
    if (this.isDeleted) return left(new Error(`Unable to delete User "${this.id}". User is deleted.`));

    const deleteOperation = await this.repository.delete(this.id);

    if (isLeft(deleteOperation)) return left(new Error(`Unable to delete User "${this.id}". ${deleteOperation.left}`));

    this._isDeleted = true;

    return right(this);
  };
}
