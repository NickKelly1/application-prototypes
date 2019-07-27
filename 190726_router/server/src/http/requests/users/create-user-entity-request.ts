import { UserEntityAttributes, UserEntity } from '../../../data/entities/user-entity';

export class CreateUserEntityRequest {
  public static validate = (requestBody: unknown) => {
    //
  };

  public body: Omit<UserEntityAttributes, UserEntity['primaryKey']>;

  public constructor(body: Omit<UserEntityAttributes, UserEntity['primaryKey']>) {
    this.body = body;
  }
}
