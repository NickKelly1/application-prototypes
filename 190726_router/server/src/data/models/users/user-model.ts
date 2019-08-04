import * as ioTs from 'io-ts';
import { UserAttributesCodec, UserAttributes, UserRecord } from '../../codecs/user-codecs';
import { ValidationReporter } from '../../../validation/helpers/validation-reporter';
import { isLeft } from 'fp-ts/lib/Either';
import { UserRepository } from '../../database/user-repository';

// https://github.com/gcanti/io-ts

/**
 * User Class
 */
export class UserModel {
  private static attributesCodec = UserAttributesCodec;

  public readonly id: number;

  public attributes: UserAttributes;

  private repository: UserRepository;

  public constructor(id: UserRecord['id'], attributes: UserAttributes, repository: UserRepository) {
    this.id = id;
    this.attributes = attributes;
    this.repository = repository;
  }
}
