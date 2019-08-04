import { CreateUserRequest } from '../requests/users/create-user-request';
import { UpdateUserRequest } from '../requests/users/update-user-request';
import { UserModel, USER_STATUS } from '../../data/models/users/user-model';
import { ControllerResponse } from '../../../@types/helpers/application-types';
import { right } from 'fp-ts/lib/Either';

export class UserController {
  public index = async () => {
    //
  };

  public get = async (id: number) => {
    //
  };

  public create = async (req: CreateUserRequest) => {
    const { name, password } = req.body;
    const newUser = {
      name,
      password,
      status: USER_STATUS.ACTIVATED,
    };
    // parse password

    // const user = new UserModel();
    return right({ status: 144, response: { q: 'e' } });
  };

  public update = async (req: UpdateUserRequest) => {
    //
  };

  public delete = async (id: number) => {
    //
  };
}
