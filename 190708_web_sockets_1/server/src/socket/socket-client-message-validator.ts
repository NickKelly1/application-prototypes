import { UserAuth, AuthTokenUserMap } from '../models/user-model';
import { hasStringProperty, hasObjectProperty } from '../helpers/has-property';
import { APP_CONSTANTS } from '../shared/app-constants';
import { SOCKET_CLIENT_MESSAGE, SocketClientMessagePayloads } from '../shared/socket-client-messages';
import { WithMessage, SocketMessagePayloadValidator } from '../../@types/socket-types';

/**
 * @description
 * Determine if a payload contains authentication
 * Type guard
 *
 * @param payload
 */
const hasAuth = <T extends Record<string, any>>(payload: T): payload is T & { auth: UserAuth } =>
  hasObjectProperty(payload, 'auth') && hasStringProperty(payload.auth, 'token');

/**
 * @description
 * Is the authentication valid? (is the user currently logged in?)
 *
 * @param userAuth
 * @param authTokenUserMap
 * @param dateFunc
 */
const isLoggedInUser = (userAuth: UserAuth, authTokenUserMap: AuthTokenUserMap, dateFunc = () => Date.now()) => {
  const userSession = authTokenUserMap.get(userAuth.token);
  if (userSession && userSession.expiresAt < dateFunc()) return true;
  return false;
};

/**
 * Socket Client Message Validators
 */
export const SocketClientPayloadSanitizer: SocketMessagePayloadValidator<
  SOCKET_CLIENT_MESSAGE,
  SocketClientMessagePayloads
> = {
  /**
   * @description
   * New Message Client socket validation handler
   *
   * @param authTokenUserMap
   * @param payload
   * @param errors mutable list of errors
   */
  [SOCKET_CLIENT_MESSAGE.NEW_MESSAGE]: (
    authTokenUserMap: AuthTokenUserMap,
    unsanitizedPayload: WithMessage<SOCKET_CLIENT_MESSAGE['NEW_MESSAGE']>,
    sanitizedPayload: {},
    errors: string[],
  ): sanitizedPayload is SocketClientMessagePayloads[SOCKET_CLIENT_MESSAGE['NEW_MESSAGE']] => {
    if (!hasAuth(unsanitizedPayload)) {
      errors.push('missing authentication');
      return false;
    }
    if (!isLoggedInUser(unsanitizedPayload.auth, authTokenUserMap)) {
      errors.push('log-in expired');
      return false;
    }
    if (!hasStringProperty(unsanitizedPayload, 'message')) {
      errors.push('must provide a message');
      return false;
    }
    if (payload.message.length > APP_CONSTANTS.MAX_MESSAGE_LENGTH) {
      errors.push(`message exceeded maximum length: ${APP_CONSTANTS.MAX_MESSAGE_LENGTH}`);
      return false;
    }

    sanitizedPayload = { aids: 'hello' };

    return true;
  },

  /**
   * @description
   * Sign in attempt
   *
   * @param authTokenUserMap
   * @param payload
   * @param errors mutable list of errors
   */
  [SOCKET_CLIENT_MESSAGE.ATTEMPT_SIGN_UP]: (
    authTokenUserMap: AuthTokenUserMap,
    payload: WithMessage<SOCKET_CLIENT_MESSAGE['ATTEMPT_SIGN_UP']>,
    errors: string[],
  ): payload is SocketClientMessagePayloads[SOCKET_CLIENT_MESSAGE['ATTEMPT_SIGN_UP']] => {
    if (!hasStringProperty(payload, 'email')) {
      errors.push('no email provided');
      return false;
    }
    if (!hasStringProperty(payload, 'name')) {
      errors.push('no name provided');
      return false;
    }
    if (!hasStringProperty(payload, 'password')) {
      errors.push('no password provided');
      return false;
    }
    if (payload.email.length > APP_CONSTANTS.MAX_EMAIL_LENGTH) {
      errors.push(`message exceeded maximum length: ${APP_CONSTANTS.MAX_EMAIL_LENGTH}`);
      return false;
    }
    if (payload.name.length > APP_CONSTANTS.MAX_NAME_LENGTH) {
      errors.push(`name exceeded maximum length: ${APP_CONSTANTS.MAX_NAME_LENGTH}`);
      return false;
    }
    if (payload.password.length > APP_CONSTANTS.MAX_PASSWORD_LENGTH) {
      errors.push(`password exceeded maximum length: ${APP_CONSTANTS.MAX_PASSWORD_LENGTH}`);
      return false;
    }

    return true;
  },

  /**
   * @description
   * Log in attempt
   *
   * @param authTokenUserMap
   * @param payload
   * @param errors mutable list of errors
   */
  [SOCKET_CLIENT_MESSAGE.ATTEMPT_LOG_IN]: (
    authTokenUserMap: AuthTokenUserMap,
    payload: WithMessage<SOCKET_CLIENT_MESSAGE['ATTEMPT_LOG_IN']>,
    errors: string[],
  ): payload is SocketClientMessagePayloads[SOCKET_CLIENT_MESSAGE['ATTEMPT_LOG_IN']] => {
    if (!hasStringProperty(payload, 'email')) {
      errors.push('no email provided');
      return false;
    }
    if (!hasStringProperty(payload, 'email')) {
      errors.push('no email provided');
      return false;
    }
    if (!hasStringProperty(payload, 'name')) {
      errors.push('no name provided');
      return false;
    }
    if (!hasStringProperty(payload, 'password')) {
      errors.push('no password provided');
      return false;
    }

    return true;
  },

  /**
   * @description
   * Join room attempt
   *
   * @param authTokenUserMap
   * @param payload
   * @param errors mutable list of errors
   */
  [SOCKET_CLIENT_MESSAGE.ATTEMPT_JOIN_ROOM]: (
    authTokenUserMap: AuthTokenUserMap,
    payload: WithMessage<SOCKET_CLIENT_MESSAGE['ATTEMPT_JOIN_ROOM']>,
    errors: string[],
  ): payload is SocketClientMessagePayloads[SOCKET_CLIENT_MESSAGE['ATTEMPT_JOIN_ROOM']] => {
    if (!hasAuth(payload)) {
      errors.push('missing authentication');
      return false;
    }
    if (!isLoggedInUser(payload.auth, authTokenUserMap)) {
      errors.push('log-in expired');
      return false;
    }
    if (!hasStringProperty(payload, 'id')) {
      errors.push('no room id provided');
      return false;
    }

    return true;
  },

  [SOCKET_CLIENT_MESSAGE.TYPING]: (
    authTokenUserMap: AuthTokenUserMap,
    payload: WithMessage<SOCKET_CLIENT_MESSAGE['TYPING']>,
    errors: string[],
  ): payload is SocketClientMessagePayloads[SOCKET_CLIENT_MESSAGE['TYPING']] => {
    if (!hasAuth(payload)) {
      errors.push('missing authentication');
      return false;
    }
    if (!isLoggedInUser(payload.auth, authTokenUserMap)) {
      errors.push('log-in expired');
      return false;
    }

    return true;
  },

  [SOCKET_CLIENT_MESSAGE.STOP_TYPING]: (
    authTokenUserMap: AuthTokenUserMap,
    payload: WithMessage<SOCKET_CLIENT_MESSAGE['STOP_TYPING']>,
    errors: string[],
  ): payload is SocketClientMessagePayloads[SOCKET_CLIENT_MESSAGE['STOP_TYPING']] => {
    if (!hasAuth(payload)) {
      errors.push('missing authentication');
      return false;
    }
    if (!isLoggedInUser(payload.auth, authTokenUserMap)) {
      errors.push('log-in expired');
      return false;
    }

    return true;
  },

  [SOCKET_CLIENT_MESSAGE.LOG_OUT]: (
    authTokenUserMap: AuthTokenUserMap,
    payload: WithMessage<SOCKET_CLIENT_MESSAGE['LOG_OUT']>,
    errors: string[],
  ): payload is SocketClientMessagePayloads[SOCKET_CLIENT_MESSAGE['LOG_OUT']] => {
    if (!hasAuth(payload)) {
      errors.push('missing authentication');
      return false;
    }
    if (!isLoggedInUser(payload.auth, authTokenUserMap)) {
      errors.push('log-in expired');
      return false;
    }

    return true;
  },
} as const;

const SocketClientMessageValidator = {
  isValid,
};
