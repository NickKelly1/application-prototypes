// import { v } from '../../../validation/validator';
import { UserEntityAttributes, UserEntity } from '../../../data/entities/user-entity';
import { UnsanitisedObject } from '../../../../@types/helpers/helper-types';

// // @see https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja

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
