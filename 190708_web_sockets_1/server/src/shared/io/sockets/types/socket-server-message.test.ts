import { resolve } from 'path';
import Ajv from 'ajv';
import { SOCKET_SERVER_MESSAGE_TYPE, SocketServerMessage } from './socket-server-message';
const ajv = Ajv();

const SOCKET_SERVER_MESSAGE_PAYLOAD_SCHEMAS_PATH = resolve(__dirname, '../schemas/socket-server-message.schema.json');

/**
 * @test
 *
 * @note
 * Requires running "yarn build:schemas" before testing to build the json-schemas that are tested
 *
 * @description
 * Socket server message schemas
 */
describe('Socket Server Messages schemas', () => {
  /**
   * @test
   *
   * @description
   * Should accept valid messages
   */
  describe('Should positively validate', () => {
    const schema = ajv.compile(require(SOCKET_SERVER_MESSAGE_PAYLOAD_SCHEMAS_PATH));

    const chatMessageIdString = 'chatMessageIdString';
    const roomIdString = 'roomIdString';
    const stringEmail = 'stringEmail';
    const userIdString = 'userIdString';
    const stringPassword = 'stringPassword';

    const goodPayloads: SocketServerMessage[] = [
      {
        _type: SOCKET_SERVER_MESSAGE_TYPE.LOG_IN_FAIL,
        email: stringEmail,
        password: stringPassword,
      },
      {
        _type: SOCKET_SERVER_MESSAGE_TYPE.LOG_IN_SUCCESS,
        user_id: userIdString,
      },
      {
        _type: SOCKET_SERVER_MESSAGE_TYPE.NEW_CHAT_MESSAGE,
        chat_message_id: chatMessageIdString,
      },
      {
        _type: SOCKET_SERVER_MESSAGE_TYPE.SIGN_UP_FAIL,
        email: stringEmail,
        password: stringPassword,
      },
      {
        _type: SOCKET_SERVER_MESSAGE_TYPE.SIGN_UP_SUCCESS,
        user_id: userIdString,
      },
      {
        _type: SOCKET_SERVER_MESSAGE_TYPE.USER_JOINED_ROOM,
        user_id: userIdString,
        room_id: roomIdString,
      },
      {
        _type: SOCKET_SERVER_MESSAGE_TYPE.USER_LEFT_ROOM,
        user_id: userIdString,
        room_id: roomIdString,
      },
      {
        _type: SOCKET_SERVER_MESSAGE_TYPE.USER_STOPPED_TYPING,
        user_id: userIdString,
      },
      {
        _type: SOCKET_SERVER_MESSAGE_TYPE.USER_TYPING,
        user_id: userIdString,
      },
    ];

    // demonstrate that every possible message is tested
    Object.values(SOCKET_SERVER_MESSAGE_TYPE).forEach(socketServerMessageType => {
      it(`Should test ${socketServerMessageType}`, () => {
        expect(goodPayloads.some(goodPayload => goodPayload._type === socketServerMessageType)).toBe(true);
      });
    });

    goodPayloads.forEach(goodPayload => {
      it(`Should accept ${goodPayload._type}`, () => {
        expect(schema(goodPayload)).toBe(true);
      });
    });
  });

  // TODO: Test validation fails appropriately
});
