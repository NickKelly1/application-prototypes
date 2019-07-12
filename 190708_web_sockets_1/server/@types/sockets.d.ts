import { UserAuth } from '../src/models/user';

interface WithAuth {
  auth: UserAuth;
}

export interface WithMessage<T extends string> {
  _message: T;
}
