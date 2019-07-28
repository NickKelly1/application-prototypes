import { UserEntityAttributes, UserEntity } from '../../../data/entities/user-entity';
import { ContainsWords } from '../../../validation/contains-words';
import { sequenceT } from 'fp-ts/lib/Apply';
import { getValidation, right, left, Either, map, chain, isRight, isLeft } from 'fp-ts/lib/Either';
import { getSemigroup, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { pipe } from 'fp-ts/lib/pipeable';
import { AStringKeyOf } from '../../../../@types/helpers/helper-types';

// ContainsWords.validate();

// @see https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5ejaj

const minLength = (s: string): Either<NonEmptyArray<string>, string> => (s.length > 5 ? right(s) : left(['too short']));
const hasA = (s: string): Either<NonEmptyArray<string>, string> => (s.includes('a') ? right(s) : left(["doesn't have a"]));
const hasB = (s: string): Either<NonEmptyArray<string>, string> => (s.includes('b') ? right(s) : left(["doesn't have b"]));

const applicativeValidation = getValidation(getSemigroup<string>());

export class CreateUserEntityRequest {
  public static validate = (
    requestBody: Partial<Record<AStringKeyOf<Omit<UserEntityAttributes, UserEntity['primaryKey']>>, unknown>>,
  ) => {
    //
  };

  private static validateUser = (u: unknown) => {
    // TODO
    return pipe(sequenceT(applicativeValidation)(this.fullValidateName));
  };

  public static fullValidateName = (u: unknown) => {
    const isString = pipe(
      u !== undefined ? right(u) : left(['TODO <fieldname> must exist...']),
      chain(u => (typeof u === 'string' ? right(u) : left(['TODO <fieldname> must be a string...']))),
    );

    if (isLeft(isString)) return isString;

    const s = isString.right;

    return pipe(
      sequenceT(getValidation(getSemigroup<string>()))(minLength(s), hasA(s), hasB(s)),
      // if no errors, simply return s
      map(() => s),
    );
  };

  public static validateIsString = (u: unknown) => {
    return pipe(
      u !== undefined ? right(u) : left(['TODO <fieldname> must exist...']),
      chain(u => (typeof u === 'string' ? right(u) : left(['TODO <fieldname> must be a string...']))),
    );
  };

  public static validateName = (s: string) => {
    return pipe(
      sequenceT(getValidation(getSemigroup<string>()))(minLength(s), hasA(s), hasB(s)),
      // if no errors, simply return s
      map(() => s),
    );
  };

  // public static sanitize = ([])

  public body: Omit<UserEntityAttributes, UserEntity['primaryKey']>;

  public constructor(body: Omit<UserEntityAttributes, UserEntity['primaryKey']>) {
    this.body = body;
  }
}

const frst = 'frst';
const second = 'second';
const thirda = 'thirda';
const fourthb = 'fourthb';
const fifthab = 'fifthab';

console.log('-------------------------------------------------');
console.log('----------------- validateName ------------------');
console.log(frst, CreateUserEntityRequest.fullValidateName(frst));
console.log(second, CreateUserEntityRequest.fullValidateName(second));
console.log(thirda, CreateUserEntityRequest.fullValidateName(thirda));
console.log(fourthb, CreateUserEntityRequest.fullValidateName(fourthb));
console.log(fifthab, CreateUserEntityRequest.fullValidateName(fifthab));
console.log(fifthab, CreateUserEntityRequest.fullValidateName(undefined));
