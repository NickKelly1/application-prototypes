import * as cv from 'class-validator';
import { UserAttributes } from '../../user.model';

export class CreateUserCommandDto {
  @cv.IsEmail()
  @cv.IsNotEmpty()
  email!: UserAttributes['email'];

  @cv.IsString()
  @cv.IsNotEmpty()
  first!: UserAttributes['first'];

  @cv.IsString()
  @cv.IsNotEmpty()
  last!: UserAttributes['last'];

  @cv.IsString()
  middle!: UserAttributes['middle'];

  @cv.IsString()
  @cv.IsNotEmpty()
  password!: UserAttributes['password'];
}
