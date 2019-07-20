import Ajv from 'ajv';
import { resolve } from 'path';
import { SocketServerMessage } from '../types/socket-server-message';
const ajv = Ajv();

const socketServerMessageSchema = ajv.compile(require(resolve(__dirname, '../schemas/socket-server-message.schema.json')));

/**
 * @description
 * Assert the input is a valid Socket Server Message
 *
 * inspiration from @see https://spin.atomicobject.com/2018/03/26/typescript-data-validation/
 *
 * @param input
 */
export const isValidSocketServerMessage = (input: unknown): input is SocketServerMessage => {
  return socketServerMessageSchema(input) === true;
};
