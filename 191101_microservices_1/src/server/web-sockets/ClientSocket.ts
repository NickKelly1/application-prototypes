import * as ioTs from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { Socket } from 'socket.io';
import { TypedEvent, hasStringProperty, hasObjectProperty, AValueOf } from '@syntaxfanatics/peon';
import { ORDER_COMMANDS, ORDER_COMMAND } from '../../shared/domains/orders/ORDER_COMMANDS';
import { isLeft, Either, right, isRight, left, Left, Right, chain, map, mapLeft, flatten } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { ifRight, mapBoth } from '../../shared/helpers/either-helpers';

type RawMessageShape = { type: string; payload: Record<string, any> };

/**
 * Map the type and payload back to a message to be consumed in the application
 *
 * @param type
 */
function remapMessage<T>(type: T) {
  return function doRemap<P>(payload: P) {
    return { type, payload };
  }
}



/**
 * Verify a message fits the desired shape
 *
 * @param decoder
 */
function verify<A>(decoder: ioTs.Decode<unknown, A>) {
  return function<T extends string>(payload: unknown) {
    const result = decoder(payload);
    return result;
  }
}



function leftPathReport(errors: ioTs.Errors) {
  return PathReporter.report(left(errors));
}



/**
 * Is the message of the correct shape
 *
 * @param message
 */
function hasRawMessageShape(message: unknown) {
  if (!(message instanceof Object
    && hasStringProperty(message, 'type')
    && hasObjectProperty(message, 'payload')
  )) return left(undefined);

  return right(message as RawMessageShape);
}


const commandValidatorMap = {
  [ORDER_COMMANDS.NAMES.CREATE_ORDER]: (payload: Record<string, any>) => ifRight(verify(ORDER_COMMANDS.CODECS.CREATE_ORDER.decode)(payload))(remapMessage(ORDER_COMMANDS.NAMES.CREATE_ORDER)),
  [ORDER_COMMANDS.NAMES.UPDATE_ORDER]: (payload: Record<string, any>) => ifRight(verify(ORDER_COMMANDS.CODECS.UPDATE_ORDER.decode)(payload))(remapMessage(ORDER_COMMANDS.NAMES.UPDATE_ORDER)),
  [ORDER_COMMANDS.NAMES.DELETE_ORDER]: (payload: Record<string, any>) => ifRight(verify(ORDER_COMMANDS.CODECS.DELETE_ORDER.decode)(payload))(remapMessage(ORDER_COMMANDS.NAMES.DELETE_ORDER)),
}


type Command = RightValue<ReturnType<AValueOf<typeof commandValidatorMap>>>;



type RightValue<T> = T extends Right<infer R> ? R : never;
type LeftValue<T> = T extends Left<infer L> ? L : never;



/**
 * Apply a validator to a raw message
 *
 * @param message
 */
function applyMessageValidator(message: RawMessageShape) {
  return function doApplyMessageValidator<V extends AValueOf<typeof commandValidatorMap>>(validator: V) {
    // "as" is required to map the union of rights into a right of unions (required for either processing)
    return validator(message.payload) as Either<LeftValue<ReturnType<V>>, RightValue<ReturnType<V>>>;
  }
}

/**
 * Find
 *
 * @param message
 */
function findMessageValidator(message: RawMessageShape) {
  const validator = (commandValidatorMap as Record<string, AValueOf<typeof commandValidatorMap>>)[message.type];
  if (!validator) return left(undefined);
  return right(validator);
}



const MESSAGE_FAILURE_REASON = {
  BAD_MESSAGE_SHAPE: 'bad shape',
  UNHANDLED_COMMAND_TYPE: 'unhandled command type',
  BAD_COMMAND_SHAPE: 'bad command shape',
} as const
type MESSAGE_FAILURE_REASON = typeof MESSAGE_FAILURE_REASON;



type MessageFailure =
  { reason: MESSAGE_FAILURE_REASON['BAD_COMMAND_SHAPE']; description: string }
  | { reason: MESSAGE_FAILURE_REASON['UNHANDLED_COMMAND_TYPE']; description: string }
  | { reason: MESSAGE_FAILURE_REASON['BAD_COMMAND_SHAPE']; description: string }



/**
 * Preprocess a message, verifying its shape
 *
 * @param unknownMessage
 */
function preprocessMessage(unknownMessage: unknown): Either<MessageFailure, Command> {
  const preprocessed = pipe(
    hasRawMessageShape(unknownMessage),
    mapLeft(() => ({ reason: MESSAGE_FAILURE_REASON.BAD_COMMAND_SHAPE, description: '[ClientSocket::handleSocketMessage] bad message shape' }) as MessageFailure),
    map(rawMessage => pipe(
      findMessageValidator(rawMessage),
      mapLeft(() => ({ reason: MESSAGE_FAILURE_REASON.UNHANDLED_COMMAND_TYPE, description: `[ClientSocket::applyMessageValidator] unhandled message type "${rawMessage.type}"`}) as MessageFailure),
      map(applyMessageValidator(rawMessage)),
      map(validatorResult => pipe(
        mapLeft(leftPathReport)(validatorResult),
        // stringify report
        mapLeft((errors) => ({ reason: MESSAGE_FAILURE_REASON.BAD_COMMAND_SHAPE, description: errors.reduce((acc, n) => `${acc && '\n'}${n}`, '') }) as MessageFailure),
      )),
      flatten,
    )),
    flatten,
  );

  return preprocessed;
}


/**
 * Client Socket wrapper
 */
export class ClientSocket extends TypedEvent<Command> {
  socket: Socket;

  constructor(socket: Socket) {
    super();
    this.socket = socket;
    socket.on('message', this.handleSocketMessage);
  }

  /**
   * Handle receipt of a valid command
   *
   * @param command
   */
  handleCommand(command: Command) {
    this.emit(command);
  }

  /**
   * Handle a failed message
   *
   * @param fail
   */
  handleFailedMessage(fail: MessageFailure) {
    const description = `[Reason]: ${fail.reason}\n[Description]: ${fail.description}`;
    console.log(description);
  }


  /**
   * Handle receipt of a socket message
   *
   * @param unknownMessage
   */
  handleSocketMessage(unknownMessage: unknown) {
    pipe(
      preprocessMessage(unknownMessage),
      mapBoth(
        this.handleFailedMessage,
        this.handleCommand,
      )
    );
  }
}
