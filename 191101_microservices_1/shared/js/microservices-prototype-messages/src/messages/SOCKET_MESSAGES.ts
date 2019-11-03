import * as ioTs from 'io-ts';
import { hasStringProperty, hasObjectProperty, AValueOf } from '@syntaxfanatics/peon';
import { left, right, mapLeft, map, flatten, Either } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { LeftValue, RightValue } from 'fp-ts-helpers';
import { leftPathReport } from 'io-ts-helpers';



export type RawMessageShape = { type: string; payload: Record<string, any> };

export type MessageValidator<M> = (payload: Record<string, any>) => Either<ioTs.Errors, M>;
export type MessageValidatorMap<M> = Record<string, MessageValidator<M>>;
export type MessagePreprocessor<M> = (unknownMessage: unknown) => Either<MESSAGE_FAILURE, M>;



/**
 * Is the message of the correct shape
 *
 * @param message
 */
export function hasRawMessageShape(message: unknown) {
  if (!(message instanceof Object
    && hasStringProperty(message, 'type')
    && hasObjectProperty(message, 'payload')
  )) return left(undefined);

  return right(message as RawMessageShape);
}



export const MESSAGE_FAILURE_REASON = {
  BAD_MESSAGE_SHAPE: 'bad shape',
  UNHANDLED_MESSAGE_TYPE: 'unhandled command type',
  DECODE_FAILED: 'decode failed',
} as const
export type MESSAGE_FAILURE_REASON = typeof MESSAGE_FAILURE_REASON;



export type MESSAGE_FAILURE =
  { reason: MESSAGE_FAILURE_REASON['DECODE_FAILED']; description: string }
  | { reason: MESSAGE_FAILURE_REASON['UNHANDLED_MESSAGE_TYPE']; description: string }
  | { reason: MESSAGE_FAILURE_REASON['DECODE_FAILED']; description: string }



/**
 * Map the type and payload back to a message to be consumed in the application
 *
 * @param type
 */
export function remapMessage<T>(type: T) {
  return function doRemap<P>(payload: P) {
    return { type, payload };
  }
}


/**
 * Apply a validator to a raw message
 *
 * @param message
 */
export  function applyMessageValidator(message: RawMessageShape) {
  return function doApplyMessageValidator<V extends (payload: Record<string, any>) => Either<any, any>>(validator: V) {
    return validator(message.payload) as Either<LeftValue<ReturnType<V>>, RightValue<ReturnType<V>>>;
  }
}



/**
 * Creates a function that can be passed a message and finds the validator corresponding to the message
 *
 * @param message
 */
function findMessageValidatorFactory<M>(validatorMap: MessageValidatorMap<M>) {
  return function doFindMessageValidator(message: RawMessageShape) {
    const validator = validatorMap[message.type];
    if (!validator) return left(undefined);
    return right(validator);
  }
}



/**
 * Preprocess a message, verifying its shape
 *
 * @param unknownMessage
 */

export function messagePreprocessorFactory<M>(validatorMap: MessageValidatorMap<M>): MessagePreprocessor<M> {
  return function preprocessMessage(unknownMessage: unknown) {
    const result = pipe(
      hasRawMessageShape(unknownMessage),
      mapLeft(() => ({ reason: MESSAGE_FAILURE_REASON.DECODE_FAILED, description: '[preprocessMessage] bad message shape' }) as MESSAGE_FAILURE),
      map(rawMessage => pipe(
        findMessageValidatorFactory(validatorMap)(rawMessage),
        mapLeft(() => ({ reason: MESSAGE_FAILURE_REASON.UNHANDLED_MESSAGE_TYPE, description: `[preprocessMessage] unhandled message type "${rawMessage.type}"`}) as MESSAGE_FAILURE),
        map(applyMessageValidator(rawMessage)),
        map(validatorResult => pipe(
          mapLeft(leftPathReport)(validatorResult),
          mapLeft((errors) => ({ reason: MESSAGE_FAILURE_REASON.DECODE_FAILED, description: `[preprocessMessage] ${errors.reduce((acc, n) => `${acc && '\n'}${n}`, '')}` }) as MESSAGE_FAILURE),
        )),
        flatten,
      )),
      flatten,
    );

    return result;
  }
}