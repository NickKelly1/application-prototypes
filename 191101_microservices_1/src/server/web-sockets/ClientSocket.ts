import * as ioTs from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { Socket } from 'socket.io';
import { TypedEvent, hasStringProperty, hasObjectProperty, AValueOf } from '@syntaxfanatics/peon';
import { ORDER_COMMANDS, ORDER_COMMAND } from '../../shared/domains/orders/ORDER_COMMANDS';
// import * as tEither from 'fp-ts/lib/TaskEither';
import { isLeft, Either, right, isRight, left, Left, Right, chain, map, mapLeft, flatten } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';

type RawMessageShape = { type: string; payload: Record<string, any> };

function ifRight<L, R>(data: Either<L, R>) {
  return function onThis<O>(applyFn: (inp: R) => O): Either<L, O> {
    if (isRight(data)) return right(applyFn(data.right));
    return data;
  }
}

function ifLeft<L, R>(data: Either<L, R>) {
  return function onThis<O>(applyFn: (inp: L) => O): Either<O, R> {
    if (isLeft(data)) return left(applyFn(data.left));
    return data;
  }
}

/**
 * Map the left and right paths separately
 *
 * @param data
 */
function mapBoth<L, R>(data: Either<L, R>) {
  return function <L2, R2>(onLeft: (l: L) => L2, onRight: (r: R) => R2): L2 | R2 {
    if (isLeft(data)) return onLeft(data.left);
    return onRight(data.right);
  }
}

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
  )) return left(false);

  return right(message as RawMessageShape);
}


/**
 * Wrap the return of a function in a right
 *
 * @param fn
 */
function leftify<T extends (...args: any[]) => any>(applier: T) {
  return function applyRightify(...args: Parameters<T>) {
    return left(applier(...args)) as Left<ReturnType<T>>;
  }
}

/**
 * Wrap the return of a function in a right
 *
 * @param fn
 */
function rightify<T extends (...args: any[]) => any>(fn: T) {
  return function applyRightify(...args: Parameters<T>) {
    return right(fn(...args)) as Right<ReturnType<T>>;
  }
}

/**
 * Transform a bolean returning function into an either returning function
 *
 * @param fn
 */
function boolToEither<F extends (...args: any[]) => false | R, R>(fn: F) {
  return function doBoolToEither(...args: Parameters<F>): Either<false, R> {
    const res = fn(...args);
    return res
      ? (right(res) as Right<R>)
      : (left(res) as Left<false>);
  }
}


/**
 * Handle a socket message
 *
 * @param message
 */
function validateRawMessage(message: RawMessageShape) {
  const { type, payload } = message;

  switch (type) {
    case ORDER_COMMANDS.NAMES.CREATE_ORDER: return right(ifRight(verify(ORDER_COMMANDS.CODECS.CREATE_ORDER.decode)(payload))(remapMessage(type)));
    case ORDER_COMMANDS.NAMES.UPDATE_ORDER: return right(ifRight(verify(ORDER_COMMANDS.CODECS.UPDATE_ORDER.decode)(payload))(remapMessage(type)));
    case ORDER_COMMANDS.NAMES.DELETE_ORDER: return right(ifRight(verify(ORDER_COMMANDS.CODECS.DELETE_ORDER.decode)(payload))(remapMessage(type)));
  }

  return left(`[ClientSocket::validateRawMessage] unhandled message type ${type}`);
}



function flip2<A1, A2, F extends (a1: A1) => (a2: A2) => any>(fn: F) {
  return function (f2: A2) {
    return function (f1: A1) {
      return fn(f1)(f2);
    }
  }
}

export class ClientSocket extends TypedEvent<ORDER_COMMAND> {
  socket: Socket;

  constructor(socket: Socket) {
    super();
    this.socket = socket;
    socket.on('message', this.handleSocketMessage);
  }

  handleValidMessage(message: any) {
    //
  }

  handleSocketMessage(message: unknown) {
    // const result = validateRawMessage(message);

    // TODO: flatten union...
    const z = pipe(
      hasRawMessageShape(message),
      map(validateRawMessage),
      map(flip2(ifLeft)(leftPathReport))
      // map(validationResult => pipe(
      //   validationResult,
      //   mapLeft((errors) => PathReporter.report(errors))
      // )),
    );
  }
}
