// import { v } from '../../../validation/validator';
import { UserEntityAttributes, UserEntity } from '../../../data/entities/user-entity';
import { UnsanitisedObject } from '../../../../@types/helpers/helper-types';

// // @see https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja
// https://lorefnon.tech/2018/03/25/typescript-and-validations-at-runtime-boundaries/
// https://gcanti.github.io/io-ts/
// https://github.com/gcanti/io-ts
// https://gcanti.github.io/io-ts-types/modules/withMessage.ts.html

// const frst = 'frst';
// const second = 'second q';
// const thirda = 'thirda q';
// const fourthb = 'fourthb q';
// const fifthab = 'fifthab q';
// const fifthab3words = 'fifthab q thirdword';

// console.log('-------------------------------------------------');
// console.log('----------------- validateName ------------------');
// console.log(
//   frst,
//   v.validate(frst, true, v.isStringRule(), [
//     v.containsWordCountBetweenRule({ min: 2, max: 2 }),
//     v.containsCharactersRule({ characters: 'fifthab' }),
//   ]),
// );
// console.log(
//   second,
//   v.validate(second, true, v.isStringRule(), [
//     v.containsWordCountBetweenRule({ min: 2, max: 2 }),
//     v.containsCharactersRule({ characters: 'fifthab' }),
//   ]),
// );
// console.log(
//   thirda,
//   v.validate(thirda, true, v.isStringRule(), [
//     v.containsWordCountBetweenRule({ min: 2, max: 2 }),
//     v.containsCharactersRule({ characters: 'fifthab' }),
//   ]),
// );
// console.log(
//   fourthb,
//   v.validate(fourthb, true, v.isStringRule(), [
//     v.containsWordCountBetweenRule({ min: 2, max: 2 }),
//     v.containsCharactersRule({ characters: 'fifthab' }),
//   ]),
// );
// console.log(
//   fifthab,
//   v.validate(fifthab, true, v.isStringRule(), [
//     v.containsWordCountBetweenRule({ min: 2, max: 2 }),
//     v.containsCharactersRule({ characters: 'fifthab' }),
//   ]),
// );
// console.log(
//   fifthab3words,
//   v.validate(fifthab3words, true, v.isStringRule(), [
//     v.containsWordCountBetweenRule({ min: 2, max: 2 }),
//     v.containsCharactersRule({ characters: 'fifthab' }),
//   ]),
// );

// console.log(second, CreateUserEntityRequest.fullValidateName(second));
// console.log(thirda, CreateUserEntityRequest.fullValidateName(thirda));
// console.log(fourthb, CreateUserEntityRequest.fullValidateName(fourthb));
// console.log(fifthab, CreateUserEntityRequest.fullValidateName(fifthab));
// console.log(fifthab, CreateUserEntityRequest.fullValidateName(undefined));

export class CreateUserEntityRequest {
  public static validate = (requestBody: UnsanitisedObject<UserEntityAttributes, UserEntity['primaryKey']>) => {
    // return pipe(
    //   sequenceT(getValidation(getSemigroup<string>()))(
    //     v.validate(requestBody.name, true, isStringRule()),
    //     v.validate(requestBody.password, true, isStringRule()),
    //   ),
    //   // name
    //   // password
    //   map(),
    // );
  };

  public body: Omit<UserEntityAttributes, UserEntity['primaryKey']>;

  public constructor(body: Omit<UserEntityAttributes, UserEntity['primaryKey']>) {
    this.body = body;
  }
}

import * as ioTs from 'io-ts';
import { ThrowReporter } from 'io-ts/lib/ThrowReporter';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { isRight, fold, isLeft, Either, left, right, Left } from 'fp-ts/lib/Either';
import { isObjectMember } from '@babel/types';
import { hasStringProperty, hasNumberProperty } from '../../../helpers/has-property';
import { pipe } from 'fp-ts/lib/pipeable';

// const Person = ioTs.type({
//   name: ioTs.string,
//   age: ioTs.number,
// });

// type IPerson = ioTs.TypeOf<typeof Person>;

// const requestPayload = { name: 'Lorefnon', age: 30 };
// const validationResult = Person.decode(requestPayload);

// if (isRight(validationResult)) {
//   const person: IPerson = validationResult.right;
//   console.log('person:', person);
// } else {
//   ThrowReporter.report(validationResult);
// }

// const person: IPerson = { name: 'name' };

// const Organization = ioTs.type({
//   name: ioTs.string,
//   owner: Person,
// });

// type IOrganization = ioTs.TypeOf<typeof Organization>;

// const org: IOrganization = { name: 'qwe' };

interface CreateUserRequestBody1 {
  name: string;
  age: number;
}

const createUserRequestBody1 = new ioTs.Type<CreateUserRequestBody1, CreateUserRequestBody1, unknown>(
  'myUserType',
  (u: unknown): u is CreateUserRequestBody1 => (u instanceof Object ? true : false),
  (u: unknown, c: ioTs.Context) => {
    if (!(u instanceof Object)) return ioTs.failure(u, c, 'Must be an object');

    if (!hasStringProperty(u, 'name')) return ioTs.failure(u, c, 'Must have string "name"');
    if (!hasNumberProperty(u, 'age')) return ioTs.failure(u, c, 'Must have number "age"');

    return ioTs.success({ name: u.name, age: u.age });
  },
  ioTs.identity,
);

// const z = new ioTs.record();
// type CreateUserRequestBody2 = ioTs.TypeOf<typeof createUserRequestBody1>;

const result1 = createUserRequestBody1.decode({});

// console.dir(result1, { depth: 4 });

const isNumberRule = new ioTs.Type<number>(
  'number',
  (u: unknown): u is number => typeof u === 'number',
  (u: unknown, c) => (typeof u === 'number' ? ioTs.success(u) : ioTs.failure(u, c, "It wasn't a number!")),
  ioTs.identity,
);

const isIntegerRule = new ioTs.Type<number>(
  'integer',
  (u: unknown): u is number => typeof u === 'number',
  (u: unknown, c) =>
    typeof u === 'number' && Number.isInteger(u) ? ioTs.success(u) : ioTs.failure(u, c, "It wasn't an integer!"),
  ioTs.identity,
);

const isNonEmptyStringRule = new ioTs.Type<string>(
  'Non Empty String',
  (u: unknown): u is string => typeof u === 'string' && u.length > 0,
  (u: unknown, c) =>
    typeof u === 'string' && u.length > 0 ? ioTs.success(u) : ioTs.failure(u, c, "It wasn't a non empty string!"),
  ioTs.identity,
);

// TODO: validator factories

const isString = (check: unknown): check is string => typeof check === 'string';

const createNumberRule = (options: { integer?: boolean; min?: number; max?: number }) => {
  const optionalPredicates: ((u: number) => Either<string, number>)[] = [];

  if (options.integer) optionalPredicates.push((u: number) => (Number.isInteger(u) ? right(u) : left('Must be an integer')));

  if (hasNumberProperty(options, 'min'))
    optionalPredicates.push((u: number) => (u >= options.min ? right(u) : left(`Must be greater than ${options.min}`)));

  if (hasNumberProperty(options, 'max'))
    optionalPredicates.push((u: number) => (u <= options.max ? right(u) : left(`Must be less than ${options.max}`)));

  return new ioTs.Type<number>(
    'number',
    (u: unknown): u is number => typeof u === 'number' && optionalPredicates.every(predicate => isRight(predicate(u))),
    (u: unknown, c) => {
      if (!(typeof u === 'number')) return ioTs.failure(u, c, 'Must be a number');
      const checks = optionalPredicates.map(predicate => predicate(u));
      const errorMessages = checks.map(check => (isLeft(check) ? check.left : null)).filter(isString);
      if (errorMessages.length === 0) return ioTs.success(u);
      return ioTs.failure(u, c, errorMessages.join('\n'));
    },
    ioTs.identity,
  );
};

// console.dir(result2, { depth: 4 });
// console.dir(PathReporter.report(result2), { depth: 4 });

// const getPaths = <A>(v: t.Validation<A>): Array<string> => {
//   return pipe(
//     v,
//     fold(errors => errors.map(error => error.context.map(({ key }) => key).join('.')), () => ['no errors']),
//   );
// };

// working! if verbose...
// const getPaths = <A>(v: ioTs.Validation<A>): Record<string, string[]> => {
//   return pipe(
//     v,
//     fold(
//       errors =>
//         errors.reduce(
//           (runningErrors: Record<string, string[]>, error) => {
//             if (error.context.length > 1 && error.message)
//               runningErrors[error.context[error.context.length - 1].key] = [error.message];

//             return runningErrors;
//           },
//           ({} as any) as Record<string, string[]>,
//         ),
//       () => ({}),
//     ),
//   );
// };

// console.log(getPaths(result2));
// console.log(getPaths(CreateUserRequestBodyValidator2.decode({ name: 'hoi', age: 99 })));

const CreateUserRequestBodyValidator2 = ioTs.type({
  name: isNonEmptyStringRule,
  age: createNumberRule({ integer: true, min: -1, max: 5 }),
});

type CreateUserRequestBody2 = ioTs.TypeOf<typeof CreateUserRequestBodyValidator2>;

// CreateUserRequestBodyValidator2.decode({});

// const result2 = CreateUserRequestBodyValidator2.decode({});

const result = CreateUserRequestBodyValidator2.decode({ name: 12345, age: -5.5 });

if (isLeft(result)) {
  console.log('failed...', result);
  const errors = result.left.reduce(
    (acc, error) => {
      const key = error.context.reduce((levelAcc, level) => (levelAcc += level.key), '');
      if (!acc[key]) acc[key] = [];
      if (error.message) acc[key].push(error.message);
      return acc;
    },
    ({} as any) as Record<string, string[]>,
  );

  console.log('errors:', errors);
} else {
  console.log('passed...', result);
}

// const Product = ioTs.interface({
//   id: ioTs.number,
//   name: ioTs.string,
//   quantity: ioTs.number,
//   type: ioTs.union([ioTs.literal('FURNITURE'), ioTs.literal('BOOK')]),
// });
// type Product = ioTs.TypeOf<typeof Product>;
// // interface IProduct extends T1 {}

// const product: Product = {
//   name: 'hello :)',
//   quantity: 5,
//   type: 'BOOK',
// };

// const Products = ioTs.array(Product);

// const apiResponse = [
//   {
//     id: 1,
//     name: 'Table',
//     type: 'FURNITURE',
//     quantity: 5,
//   },
//   {
//     id: '2',
//     name: 'The Lord of the Rings',
//     type: 'BOOK',
//     quantity: 10,
//   },
// ];

// const result = Products.decode(apiResponse);

// console.log('path reporter:', PathReporter.report(result));
// ThrowReporter.report(result);

// console.dir(result, { depth: 4 });
