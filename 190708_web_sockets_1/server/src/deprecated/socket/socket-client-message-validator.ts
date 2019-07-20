import { UserAuth, AuthTokenUserMap } from '../shared/models/user-model';
import { hasStringProperty, hasObjectProperty } from '../helpers/has-property';
import { APP_CONSTANTS } from '../shared/app-constants';
import { SOCKET_CLIENT_MESSAGE, SocketClientMessagePayloads } from '../shared/socket-client-messages';
import {
  SanitizerGroup,
  SanitizationErrors,
  DoesSanitization,
  UnsanitizedPayload,
  SanitizerFunctionOutput,
} from '../../@types/helpers/sanitizer-types';
import { AStringValueOf, AStringKeyOf } from '../../@types/helpers/helper-types';
import { SocketPayloadWithAuth } from './socket-types';

/**
 * @description
 * Determine if a payload contains authentication
 * Type guard
 *
 * @param payload
 */
const hasAuth = <T extends Record<string, any>>(payload: T): payload is T & SocketPayloadWithAuth =>
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
 * @description
 * Authenticate that a payload belongs to an authenticated user
 *
 * @param payload
 * @param authTokenUserMap
 */
const authenticatePayload = <T>(
  payload: T,
  authTokenUserMap: AuthTokenUserMap,
): { isLoggedIn: true; authedPayload: SocketPayloadWithAuth & T } | { isLoggedIn: false } => {
  if (hasAuth(payload) && isLoggedInUser(payload.auth, authTokenUserMap)) {
    return { isLoggedIn: true, authedPayload: payload };
  }

  return { isLoggedIn: false };
};

// /**
//  * Socket Client Message Validators
//  */
// export const SocketClientPayloadSanitizer: SanitizerGroup<
//   SOCKET_CLIENT_MESSAGE,
//   SocketClientMessagePayloads,
//   {},
//   'auth' | '_message'
// > = {
//   /**
//    * @description
//    * New Message Client socket validation handler
//    *
//    * @param authTokenUserMap
//    * @param unsanitizedPayload
//    */
//   [SOCKET_CLIENT_MESSAGE.NEW_MESSAGE]: unsanitizedPayload => {
//     const errors = {
//       misc: [] as string[],
//       fields: { message: [] as string[] },
//     };

//     // validate auth
//     if (!hasAuth(unsanitizedPayload)) {
//       errors.misc.push('missing authentication');
//       return { hasErrors: true, errors };
//     }

//     if (!isLoggedInUser(unsanitizedPayload.auth, authTokenUserMap)) {
//       errors.misc.push('log-in expired');
//       return { hasErrors: true, errors };
//     }

//     // validate message
//     if (!hasStringProperty(unsanitizedPayload, 'message')) {
//       errors.fields.message.push('must provide a message');
//       return { hasErrors: true, errors };
//     } else if (unsanitizedPayload.message.length > APP_CONSTANTS.MAX_MESSAGE_LENGTH) {
//       errors.fields.message.push(`message exceeded maximum length: ${APP_CONSTANTS.MAX_MESSAGE_LENGTH}`);
//       return { hasErrors: true, errors };
//     }

//     return {
//       hasErrors: false,
//       sanitizedPayload: {
//         _message: SOCKET_CLIENT_MESSAGE.NEW_MESSAGE,
//         auth: unsanitizedPayload.auth,
//         message: unsanitizedPayload.message,
//       },
//     };
//   },

//   /**
//    * @description
//    * Sign in attempt
//    *
//    * @param authTokenUserMap
//    * @param unsanitizedPayload
//    */
//   [SOCKET_CLIENT_MESSAGE.ATTEMPT_SIGN_UP]: (
//     authTokenUserMap: AuthTokenUserMap,
//     unsanitizedPayload: Record<PropertyKey, unknown>,
//   ): SocketPayloadSanitizerResult<SocketClientMessagePayloads[SOCKET_CLIENT_MESSAGE['ATTEMPT_SIGN_UP']]> => {
//     const errors: SanitizationErrors<SocketClientMessagePayloads[SOCKET_CLIENT_MESSAGE['ATTEMPT_SIGN_UP']]> = {
//       misc: [],
//       fields: { email: [], name: [], password: [] },
//     };

//     // validate email
//     if (!hasStringProperty(unsanitizedPayload, 'email')) {
//       errors.fields.email.push('no email provided');
//     } else if (unsanitizedPayload.email.length > APP_CONSTANTS.MAX_EMAIL_LENGTH) {
//       errors.fields.email.push(`message exceeded maximum length: ${APP_CONSTANTS.MAX_EMAIL_LENGTH}`);
//     }

//     // validate name
//     if (!hasStringProperty(unsanitizedPayload, 'name')) {
//       errors.fields.name.push('no name provided');
//     } else if (unsanitizedPayload.name.length > APP_CONSTANTS.MAX_NAME_LENGTH) {
//       errors.fields.name.push(`name exceeded maximum length: ${APP_CONSTANTS.MAX_NAME_LENGTH}`);
//     }

//     // validate password
//     if (!hasStringProperty(unsanitizedPayload, 'password')) {
//       errors.fields.password.push('no password provided');
//     } else if (unsanitizedPayload.password.length > APP_CONSTANTS.MAX_PASSWORD_LENGTH) {
//       errors.fields.password.push(`password exceeded maximum length: ${APP_CONSTANTS.MAX_PASSWORD_LENGTH}`);
//     }

//     if (errors.misc.length || Object.keys(errors.fields).length) return { hasErrors: true, errors };

//     // TODO: fix typing to avoid revalidating the payload
//     if (
//       hasStringProperty(unsanitizedPayload, 'email') &&
//       hasStringProperty(unsanitizedPayload, 'name') &&
//       hasStringProperty(unsanitizedPayload, 'password')
//     ) {
//       return {
//         hasErrors: false,
//         sanitizedPayload: {
//           _message: SOCKET_CLIENT_MESSAGE.ATTEMPT_SIGN_UP,
//           email: unsanitizedPayload.email,
//           name: unsanitizedPayload.name,
//           password: unsanitizedPayload.password,
//         },
//       };
//     }

//     throw new Error('Unhandled Case');
//   },

//   /**
//    * @description
//    * Log in attempt
//    *
//    * @param authTokenUserMap
//    * @param unsanitizedPayload
//    */
//   [SOCKET_CLIENT_MESSAGE.ATTEMPT_LOG_IN]: (
//     authTokenUserMap: AuthTokenUserMap,
//     unsanitizedPayload: Record<PropertyKey, unknown>,
//   ): SocketPayloadSanitizerResult<SocketClientMessagePayloads[SOCKET_CLIENT_MESSAGE['ATTEMPT_LOG_IN']]> => {
//     const errors: SanitizationErrors<SocketClientMessagePayloads[SOCKET_CLIENT_MESSAGE['ATTEMPT_LOG_IN']]> = {
//       misc: [],
//       fields: { email: [], password: [] },
//     };

//     // validate email
//     if (!hasStringProperty(unsanitizedPayload, 'email')) {
//       errors.fields.email.push('no email provided');
//     }

//     // validate password
//     if (!hasStringProperty(unsanitizedPayload, 'password')) {
//       errors.fields.password.push('no password provided');
//     }

//     if (errors.misc.length || Object.keys(errors.fields).length) return { hasErrors: true, errors };

//     // TODO: fix typing to avoid revalidating the payload
//     if (hasStringProperty(unsanitizedPayload, 'email') && hasStringProperty(unsanitizedPayload, 'password')) {
//       return {
//         hasErrors: false,
//         sanitizedPayload: {
//           _message: SOCKET_CLIENT_MESSAGE.ATTEMPT_LOG_IN,
//           email: unsanitizedPayload.email,
//           password: unsanitizedPayload.password,
//         },
//       };
//     } else throw new TypeError('Invalid code exception');
//   },

//   /**
//    * @description
//    * Join room attempt
//    *
//    * @param authTokenUserMap
//    * @param unsanitizedPayload
//    */
//   [SOCKET_CLIENT_MESSAGE.ATTEMPT_JOIN_ROOM]: (
//     authTokenUserMap: AuthTokenUserMap,
//     unsanitizedPayload: Record<PropertyKey, unknown>,
//   ): SocketPayloadSanitizerResult<SocketClientMessagePayloads[SOCKET_CLIENT_MESSAGE['ATTEMPT_JOIN_ROOM']]> => {
//     const errors: SanitizationErrors<SocketClientMessagePayloads[SOCKET_CLIENT_MESSAGE['ATTEMPT_JOIN_ROOM']]> = {
//       misc: [],
//       fields: { room: [] },
//     };

//     if (!hasAuth(unsanitizedPayload)) {
//       errors.misc.push('missing authentication');
//       return { hasErrors: true, errors };
//     }
//     if (!isLoggedInUser(unsanitizedPayload.auth, authTokenUserMap)) {
//       errors.misc.push('log-in expired');
//       return { hasErrors: true, errors };
//     }
//     if (!hasStringProperty(unsanitizedPayload, 'id')) {
//       errors.misc.push('no room id provided');
//     }

//     if (errors.misc.length || Object.keys(errors.fields).length) return { hasErrors: true, errors };

//     // TODO: fix typing to avoid revalidating the unsanitizedPayload
//     if (hasStringProperty(unsanitizedPayload, 'id')) {
//       return {
//         hasErrors: false,
//         sanitizedPayload: {
//           _message: SOCKET_CLIENT_MESSAGE.ATTEMPT_JOIN_ROOM,
//           auth: unsanitizedPayload.auth,
//           room: unsanitizedPayload.id,
//         },
//       };
//     } else throw new Error('Unhandled Case');
//   },

//   /**
//    * @description
//    * Notify of typing
//    *
//    * @param authTokenUserMap
//    * @param unsanitizedPayload
//    */
//   [SOCKET_CLIENT_MESSAGE.TYPING]: (
//     authTokenUserMap: AuthTokenUserMap,
//     unsanitizedPayload: Record<PropertyKey, unknown>,
//   ): SocketPayloadSanitizerResult<SocketClientMessagePayloads[SOCKET_CLIENT_MESSAGE['TYPING']]> => {
//     const errors: SanitizationErrors<SocketClientMessagePayloads[SOCKET_CLIENT_MESSAGE['TYPING']]> = {
//       misc: [],
//       fields: { auth: [] },
//     };

//     if (!hasAuth(unsanitizedPayload)) {
//       errors.misc.push('missing authentication');
//       return { hasErrors: true, errors };
//     }
//     if (!isLoggedInUser(unsanitizedPayload.auth, authTokenUserMap)) {
//       errors.misc.push('log-in expired');
//       return { hasErrors: true, errors };
//     }

//     return {
//       hasErrors: false,
//       sanitizedPayload: {
//         _message: SOCKET_CLIENT_MESSAGE.TYPING,
//         auth: unsanitizedPayload.auth,
//       },
//     };
//   },

//   /**
//    * @description
//    * Attempt log out
//    *
//    * @param authTokenUserMap
//    * @param unsanitizedPayload
//    */
//   [SOCKET_CLIENT_MESSAGE.STOP_TYPING]: (
//     authTokenUserMap: AuthTokenUserMap,
//     unsanitizedPayload: Record<PropertyKey, unknown>,
//   ): SocketPayloadSanitizerResult<SocketClientMessagePayloads[SOCKET_CLIENT_MESSAGE['STOP_TYPING']]> => {
//     const errors: SanitizationErrors<SocketClientMessagePayloads[SOCKET_CLIENT_MESSAGE['STOP_TYPING']]> = {
//       misc: [],
//       fields: { auth: [] },
//     };

//     if (!hasAuth(unsanitizedPayload)) {
//       errors.misc.push('missing authentication');
//       return { hasErrors: true, errors };
//     }

//     if (!isLoggedInUser(unsanitizedPayload.auth, authTokenUserMap)) {
//       errors.misc.push('log-in expired');
//       return { hasErrors: true, errors };
//     }

//     return {
//       hasErrors: false,
//       sanitizedPayload: {
//         _message: SOCKET_CLIENT_MESSAGE.STOP_TYPING,
//         auth: unsanitizedPayload.auth,
//       },
//     };
//   },

//   [SOCKET_CLIENT_MESSAGE.LOG_OUT]: (
//     authTokenUserMap: AuthTokenUserMap,
//     unsanitizedPayload: Record<PropertyKey, unknown>,
//   ): SocketPayloadSanitizerResult<SocketClientMessagePayloads[SOCKET_CLIENT_MESSAGE['LOG_OUT']]> => {
//     const errors: SanitizationErrors<SocketClientMessagePayloads[SOCKET_CLIENT_MESSAGE['LOG_OUT']]> = {
//       misc: [],
//       fields: { auth: [] },
//     };

//     if (!hasAuth(unsanitizedPayload)) {
//       errors.misc.push('missing authentication');
//       return { hasErrors: true, errors };
//     }

//     if (!isLoggedInUser(unsanitizedPayload.auth, authTokenUserMap)) {
//       errors.misc.push('log-in expired');
//       return { hasErrors: true, errors };
//     }

//     return {
//       hasErrors: false,
//       sanitizedPayload: {
//         _message: SOCKET_CLIENT_MESSAGE.LOG_OUT,
//         auth: unsanitizedPayload.auth,
//       },
//     };
//   },
// } as const;
// export type SocketClientPayloadSanitizer = typeof SocketClientPayloadSanitizer;

const sanitizationHandlers = {
  /**
   * @description
   * New Message Client socket validation handler
   *
   * @param authTokenUserMap
   * @param unsanitizedPayload
   */
  [SOCKET_CLIENT_MESSAGE.NEW_MESSAGE]: <T extends UnsanitizedPayload>(unsanitizedPayload: T) => {
    const errors = {
      misc: [] as string[],
      fields: { message: [] as string[] },
    } as const;

    // validate message
    if (!hasStringProperty(unsanitizedPayload, 'message')) {
      errors.fields.message.push('must provide a message');
      return { hasErrors: true, errors } as const;
    } else if (unsanitizedPayload.message.length > APP_CONSTANTS.MAX_MESSAGE_LENGTH) {
      errors.fields.message.push(`message exceeded maximum length: ${APP_CONSTANTS.MAX_MESSAGE_LENGTH}`);
      return { hasErrors: true, errors } as const;
    }

    return {
      hasErrors: false,
      sanitizedPayload: {
        _message: SOCKET_CLIENT_MESSAGE.NEW_MESSAGE,
        auth: unsanitizedPayload.auth,
        message: unsanitizedPayload.message,
      },
    } as const;
  },
} as const;

class ClientSocketSanatizer
  implements DoesSanitization<SOCKET_CLIENT_MESSAGE, SocketClientMessagePayloads, '_message' | 'auth'> {
  private authTokenUserMap: AuthTokenUserMap;

  public constructor(authTokenUserMap: AuthTokenUserMap) {
    this.authTokenUserMap = authTokenUserMap;
  }

  /**
   * @description
   * Sanitize
   */
  public sanitize = (message: AStringValueOf<SOCKET_CLIENT_MESSAGE>, unsanitizedPayload: UnsanitizedPayload) => {
    switch (message) {
      case SOCKET_CLIENT_MESSAGE.NEW_MESSAGE:
        {
          // validateShape()
          // const authResult = authenticatePayload(unsanitizedPayload, this.authTokenUserMap);
          // if (!authResult.isLoggedIn) {
          //   console.log('user not logged in...');
          //   return;
          // }
          // const result = sanitizationHandlers[SOCKET_CLIENT_MESSAGE.NEW_MESSAGE](authResult.authedPayload);
          // if (!result.hasErrors) {
          //   result.sanitizedPayload.auth;
          // }
          // return result;
          // break;
        }

        throw new Error(`Unhandled message "${message}"`);
    }
  };
}
