import { UserAuth } from '../shared/models/user-model';
import { StringConstObject } from '../../@types/helpers/helper-types';

export interface SocketPayloadWithAuth {
  auth: UserAuth;
}

export interface SocketPayloadWithMessage<T extends string> {
  _message: T;
}

export type SocketMessages = StringConstObject;
