import { v } from '../../../validation/validator';
import { UserEntityAttributes, UserEntity } from '../../../data/entities/user-entity';
import { UnsanitisedObject } from '../../../../@types/helpers/helper-types';
import { pipe } from 'fp-ts/lib/pipeable';
import { sequenceT } from 'fp-ts/lib/Apply';
import { getValidation, map } from 'fp-ts/lib/Either';
import { isStringRule } from '../../../validation/rules/string/is-string-rule';
import { getSemigroup } from 'fp-ts/lib/NonEmptyArray';

// @see https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja

const frst = 'frst';
const second = 'second q';
const thirda = 'thirda q';
const fourthb = 'fourthb q';
const fifthab = 'fifthab q';
const fifthab3words = 'fifthab q thirdword';

console.log('-------------------------------------------------');
console.log('----------------- validateName ------------------');
console.log(
  frst,
  v.validate(frst, true, v.isString(), [
    v.containsWordCountBetween({ min: 2, max: 2 }),
    v.containsCharacters({ characters: 'fifthab' }),
  ]),
);
console.log(
  second,
  v.validate(second, true, v.isString(), [
    v.containsWordCountBetween({ min: 2, max: 2 }),
    v.containsCharacters({ characters: 'fifthab' }),
  ]),
);
console.log(
  thirda,
  v.validate(thirda, true, v.isString(), [
    v.containsWordCountBetween({ min: 2, max: 2 }),
    v.containsCharacters({ characters: 'fifthab' }),
  ]),
);
console.log(
  fourthb,
  v.validate(fourthb, true, v.isString(), [
    v.containsWordCountBetween({ min: 2, max: 2 }),
    v.containsCharacters({ characters: 'fifthab' }),
  ]),
);
console.log(
  fifthab,
  v.validate(fifthab, true, v.isString(), [
    v.containsWordCountBetween({ min: 2, max: 2 }),
    v.containsCharacters({ characters: 'fifthab' }),
  ]),
);
console.log(
  fifthab3words,
  v.validate(fifthab3words, true, v.isString(), [
    v.containsWordCountBetween({ min: 2, max: 2 }),
    v.containsCharacters({ characters: 'fifthab' }),
  ]),
);

// console.log(second, CreateUserEntityRequest.fullValidateName(second));
// console.log(thirda, CreateUserEntityRequest.fullValidateName(thirda));
// console.log(fourthb, CreateUserEntityRequest.fullValidateName(fourthb));
// console.log(fifthab, CreateUserEntityRequest.fullValidateName(fifthab));
// console.log(fifthab, CreateUserEntityRequest.fullValidateName(undefined));

export class CreateUserEntityRequest {
  public static validate = (requestBody: UnsanitisedObject<UserEntityAttributes, UserEntity['primaryKey']>) => {
    return pipe(
      sequenceT(getValidation(getSemigroup<string>()))(
        v.validate(requestBody.name, true, isStringRule()),
        v.validate(requestBody.password, true, isStringRule()),
      ),
      // name
      // password
      map(),
    );
  };

  public body: Omit<UserEntityAttributes, UserEntity['primaryKey']>;

  public constructor(body: Omit<UserEntityAttributes, UserEntity['primaryKey']>) {
    this.body = body;
  }
}
