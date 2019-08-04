// import { v } from '../../../validation/validator';
import { UnsanitisedObject } from '../../../../@types/helpers/helper-types';
import * as ioTs from 'io-ts';
import { createStringValidator } from '../../../validation/validators/string-validator';
import { isRight, Either, right } from 'fp-ts/lib/Either';
import { ValidationReporter } from '../../../validation/helpers/validation-reporter';

// // @see https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja

const CreateUserRequestBodyCodec = ioTs.type({
  name: createStringValidator({ min: 3, max: 10 }),
  password: createStringValidator({ min: 5, max: 10 }),
});

type CreateUserRequestBody = ioTs.TypeOf<typeof CreateUserRequestBodyCodec>;

export class CreateUserRequest {
  public static codec = CreateUserRequestBodyCodec;

  public static validate = (
    requestBody: UnsanitisedObject<CreateUserRequestBody>,
  ): Either<ioTs.Errors, CreateUserRequest> => {
    const result = CreateUserRequestBodyCodec.decode(requestBody);

    if (isRight(result)) return right(new CreateUserRequest(result.right));

    return result;
  };

  public body: CreateUserRequestBody;

  public constructor(body: CreateUserRequestBody) {
    this.body = body;
  }
}

// const
console.log(ValidationReporter.report(CreateUserRequestBodyCodec.decode({})));
