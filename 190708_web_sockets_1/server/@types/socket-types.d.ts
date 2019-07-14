/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserAuth, AuthTokenUserMap } from '../src/models/user-model';
import { AStringOrNumberValueOf, StringConstObject } from './helper-types';

interface WithAuth {
  auth: UserAuth;
}

export interface WithMessage<T extends string | number> {
  _message: T;
}

export type SocketMessages = StringConstObject;

export type SocketMessagePayloadMap<Messages extends SocketMessages> = {
  [K in AStringOrNumberValueOf<Messages>]: WithMessage<K>;
};

export type SocketMessagePayloadValidator<
  Messages extends SocketMessages,
  Payloads extends SocketMessagePayloadMap<Messages>
> = {
  [M in AStringOrNumberValueOf<Messages>]: (
    authTokenUserMap: AuthTokenUserMap,
    unsanitizedPayload: Record<PropertyKey, unknown>,
    sanitizedPayload: {},
    errors: string[],
  ) => sanitizedPayload is Payloads[M];
};
