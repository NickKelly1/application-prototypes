import { UserEntityAttributes, UserEntity } from '../../../data/entities/user-entity';
import { ContainsWords } from '../../../validation/contains-words';
import { sequenceT } from 'fp-ts/lib/Apply';
import { getValidation, right, left, Either, map } from 'fp-ts/lib/Either';
import { getSemigroup, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { pipe } from 'fp-ts/lib/pipeable';

// ContainsWords.validate();

export class CreateUserEntityRequest {
  public static validate = (requestBody: Partial<Omit<UserEntityAttributes, UserEntity['primaryKey']>>) => {
    const validateName = (s: string) => {
      const z = pipe(
        sequenceT(getValidation(getSemigroup<string>()))(
          (s: string) => (s.length > 5 ? right(s) : left(s)),
          ContainsWords.validate(s),
        ),
        map(() => s),
      );
    };

    if (!requestBody.name) throw new TypeError('oi!');

    validateName(requestBody.name);
  };

  // public static sanitize = ([])

  public body: Omit<UserEntityAttributes, UserEntity['primaryKey']>;

  public constructor(body: Omit<UserEntityAttributes, UserEntity['primaryKey']>) {
    this.body = body;
  }
}
