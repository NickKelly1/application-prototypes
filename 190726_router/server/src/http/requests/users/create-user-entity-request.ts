// import { v } from '../../../validation/validator';
import { UnsanitisedObject } from '../../../../@types/helpers/helper-types';
import ioTs from 'io-ts';
import { createStringValidator } from '../../../validation/validators/string-validator';
import { isRight, Either, right } from 'fp-ts/lib/Either';

// // @see https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja

const CreateUserEntityRequestBodyCodec = ioTs.type({
  name: createStringValidator({ min: 3, max: 10 }),
  password: createStringValidator({ min: 5, max: 10 }),
});

type CreateUserEntityRequestBody = ioTs.TypeOf<typeof CreateUserEntityRequestBodyCodec>;

export class CreateUserEntityRequest {
  public static codec = CreateUserEntityRequestBodyCodec;

  public static validate = (
    requestBody: UnsanitisedObject<CreateUserEntityRequestBody>,
  ): Either<ioTs.Errors, CreateUserEntityRequest> => {
    const result = CreateUserEntityRequestBodyCodec.decode(requestBody);

    if (isRight(result)) {
      return right(new CreateUserEntityRequest(result.right));
    }

    return result;
  };

  public body: CreateUserEntityRequestBody;

  public constructor(body: CreateUserEntityRequestBody) {
    this.body = body;
  }
}
