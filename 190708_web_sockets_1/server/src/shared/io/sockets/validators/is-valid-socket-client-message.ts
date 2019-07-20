import Ajv from 'ajv';
import { resolve } from 'path';
import { SocketClientMessage } from '../types/socket-client-message';
const ajv = Ajv();

const socketClientMessageSchema = ajv.compile(require(resolve(__dirname, '../schemas/socket-client-message.schema.json')));

/**
 * @description
 * Assert the input is a valid Socket Client Message
 *
 * inspiration from @see https://spin.atomicobject.com/2018/03/26/typescript-data-validation/
 *
 * @param input
 */
export const isValidSocketClientMessage = (input: unknown): input is SocketClientMessage => {
  return socketClientMessageSchema(input) === true;
};
