/* eslint-disable @typescript-eslint/no-explicit-any */
import { resolve } from 'path';
import Ajv from 'ajv';
import { SocketClientMessage, SOCKET_CLIENT_MESSAGE_TYPE } from './socket-client-message';
const ajv = Ajv();

const SOCKET_CLIENT_MESSAGE_PAYLOAD_SCHEMAS_PATH = resolve(__dirname, '../schemas/socket-client-message.schema.json');

/**
 * @test
 *
 * @note
 * Requires running "yarn build:schemas" before testing to build the json-schemas that are tested
 *
 * @description
 * Socket client message schemas
 */
describe('Socket Client Messages schemas', () => {
  /**
   * @test
   *
   * @description
   * Should accept valid messages
   */
  describe('Should accept valid messages', () => {
    const schema = ajv.compile(require(SOCKET_CLIENT_MESSAGE_PAYLOAD_SCHEMAS_PATH));

    const stringEmail = 'stringEmail';
    const stringPassword = 'stringPassword';
    const stringChatMessage = 'stringChatMessage';
    const authObject = { token: 'authToken' };

    const goodPayloads: SocketClientMessage[] = [
      {
        _type: SOCKET_CLIENT_MESSAGE_TYPE.ATTEMPT_LOG_IN,
        email: stringEmail,
        password: stringPassword,
      },
      {
        _type: SOCKET_CLIENT_MESSAGE_TYPE.ATTEMPT_SIGN_UP,
        email: stringEmail,
        password: stringPassword,
      },
      {
        _type: SOCKET_CLIENT_MESSAGE_TYPE.ATTEMPT_LOG_OUT,
        auth: authObject,
      },
      {
        _type: SOCKET_CLIENT_MESSAGE_TYPE.NEW_CHAT_MESSAGE,
        auth: authObject,
        chat_message: stringChatMessage,
      },
      {
        _type: SOCKET_CLIENT_MESSAGE_TYPE.STOP_TYPING,
        auth: authObject,
      },
      {
        _type: SOCKET_CLIENT_MESSAGE_TYPE.TYPING,
        auth: authObject,
      },
    ];

    // demonstrate that every possible message is tested
    Object.values(SOCKET_CLIENT_MESSAGE_TYPE).forEach(socketClientMessageType => {
      it(`Should test ${socketClientMessageType}`, () => {
        goodPayloads.some(goodPayload => goodPayload._type === socketClientMessageType);
      });
    });

    goodPayloads.forEach(goodPayload => {
      it(`Should accept ${goodPayload._type}`, () => {
        expect(schema(goodPayload)).toBe(true);
      });
    });
  });

  /**
   * @test
   *
   * @description
   * Should require authentication when necessary
   */
  describe('Should require authentication when necessary', () => {
    const schema = ajv.compile(require(SOCKET_CLIENT_MESSAGE_PAYLOAD_SCHEMAS_PATH));

    const stringChatMessage = 'stringChatMessage';
    const authObject = { token: null };

    const payloadsMissingAuth: { [index: string]: any; _type: string }[] = [
      {
        _type: SOCKET_CLIENT_MESSAGE_TYPE.ATTEMPT_LOG_OUT,
        auth: authObject,
      },
      {
        _type: SOCKET_CLIENT_MESSAGE_TYPE.NEW_CHAT_MESSAGE,
        auth: authObject,
        chat_message: stringChatMessage,
      },
      {
        _type: SOCKET_CLIENT_MESSAGE_TYPE.STOP_TYPING,
        auth: authObject,
      },
      {
        _type: SOCKET_CLIENT_MESSAGE_TYPE.TYPING,
        auth: authObject,
      },
    ];

    payloadsMissingAuth.forEach(payloadMissingAuth => {
      it(payloadMissingAuth._type, () => {
        expect(schema(payloadMissingAuth)).toBe(false);
      });
    });
  });
});
