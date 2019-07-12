import { Duplex } from 'stream';
import { Socket } from 'net';

const SOCKET_EVENT = {
  CLOSE: 'close',
  CONNECT: 'connect',
  DATA: 'data',
  DRAIN: 'drain',
  END: 'end',
  ERROR: 'error',
  LOOKUP: 'lookup',
  TIMEOUT: 'timeout',
  READY: 'ready',
  READABLE: 'readable',
};

/**
 * https://github.com/bmancini55/node-playpen
 *
 * Followed example from
 *  - http://derpturkey.com/extending-tcp-socket-in-node-js/
 *  - https://github.com/bmancini55/node-playpen/tree/master/custom-socket
 *
 * Other resources
 *  - https://nodejs.org/api/stream.html#stream_api_for_stream_implementers
 *  - https://nodejs.org/api/net.html#net_class_net_socket
 *  - https://nodejs.org/api/stream.html#stream_object_mode
 *  - https://medium.com/@nikolaystoykov/build-custom-protocol-on-top-of-tcp-with-node-js-part-1-fda507d5a262
 */
export class JsonSocket extends Duplex {
  /**
   * @description:
   *  Is reading paused?
   *
   * @note:
   *  once the readBuffer is full, we will set
   *  readingPaused to true and stop pushing
   *  data into the buffer
   *
   *  if the consumer doesn't read data then
   *  the sockets internal buffer will backup
   *  and eventually cause TCP back-pressure
   *  to propagate to the sender
   */
  private readingPaused = false;

  /**
   * @description:
   *  Wrapped Socket
   */
  private socket?: Socket;

  /**
   * @constructor
   *
   * @param socket
   */
  public constructor(socket?: Socket) {
    super({ objectMode: true });

    // used to control reading
    if (socket) this.wrapSocket(socket);
  }

  /**
   * @description:
   *  Wrap socket by duck typing events...
   */
  private wrapSocket = (socket: Socket) => {
    this.socket = socket;

    this.socket.on(SOCKET_EVENT.CLOSE, hadError => this.emit(SOCKET_EVENT.CLOSE, hadError));
    this.socket.on(SOCKET_EVENT.CONNECT, () => this.emit(SOCKET_EVENT.CONNECT));
    this.socket.on(SOCKET_EVENT.DRAIN, () => this.emit(SOCKET_EVENT.DRAIN));
    this.socket.on(SOCKET_EVENT.END, () => this.emit(SOCKET_EVENT.END));
    this.socket.on(SOCKET_EVENT.ERROR, err => this.emit(SOCKET_EVENT.ERROR, err));
    this.socket.on(SOCKET_EVENT.LOOKUP, (err, address, family, host) =>
      this.emit(SOCKET_EVENT.CONNECT, err, address, family, host),
    );
    this.socket.on(SOCKET_EVENT.READY, () => this.emit(SOCKET_EVENT.READY));
    this.socket.on(SOCKET_EVENT.TIMEOUT, () => this.emit(SOCKET_EVENT.TIMEOUT));

    // customize data events
    // readable event puts the stream into "paused" mode
    this.socket.on(SOCKET_EVENT.READABLE, this.handleReadable);
  };

  /**
   * @description:
   *  Fired when the socket becomes readable
   */
  private handleReadable = () => {
    if (!this.socket) throw new Error('Invalid state');

    while (this.readingPaused) {
      // read raw len
      const lenBuf = this.socket.read(4);
      if (!lenBuf) return;

      // convert raw len (4-bytes) to integer (unsigned 32 bit encoding)
      const len = lenBuf.readUInt32BE();

      // read json data
      const body = this.socket.read(len);
      if (!body) {
        // we don't have all the data in the message push the buffer length
        // back onto the socket so that we can try again when more data comes
        //  - this can happen if the underlying TCP connection chunks
        //    the message into multiple packets
        this.socket.unshift(lenBuf);
        return;
      }

      // convert raw json to js object
      let json;
      try {
        json = JSON.parse(body);
      } catch (ex) {
        // invalid data was provided
        // the socket is now in an invalid state
        // terminate immediately
        this.socket.destroy(ex);
        return;
      }

      // add object to JsonSockets read buffer
      // (part of Readable stream)
      // if returning false:
      //  - the read buffer is full -> stop pushing data
      //    (this is streams support for back pressure)
      let pushOk = this.push(json);

      // pause reading if consumer is slow
      if (!pushOk) this.readingPaused = true;
    }
  };

  /**
   * @description:
   *  Fired when the JsonSocket consumer calls read()
   *
   * @note:
   *  Overrides Duplex's (Readable's) _read method
   */
  public _read = () => {
    // allow further consumption of wrapped socket
    this.readingPaused = false;
    // call handleReadable on a separate execution branch
    // so the caller doesn't end up in a hung state when
    // handleReadable hangs on this.push(...) because
    // a consumer is

    // http://derpturkey.com/extending-tcp-socket-in-node-js/
    // You can skip this next paragraph if you don't want to
    // get into the weeds on why we make this call asynchronous.
    // You were warned. So, if you dig into how readable streams
    // work are implemented, you can see that _read can be
    // either synchronous or asynchronous. Our code ends in a
    // hung state when _onReadable executes synchronously and
    // JsonSocket is in paused mode and encounters a pushOk
    // failure. Why is this? Well assume that we're already
    // inside of a readable event. When _read gets called
    // synchronously it immediately pushes data to the read
    // buffer which is passed to the consumer. No new readable
    // event is triggered. This works as long as we don't
    // encounter back-pressure. When there is back-pressure,
    // the consumer gets some data but not all of it, the
    // _readingPaused flag gets set to true, but no new
    // readable event is emitted because we're already
    // inside of that event. Since there is no new readable
    // event, the user never calls read() again to clear the
    // _readingPaused flag. And the next time data arrives on
    // the socket, the _readingPaused flag is still set to
    // false, which means no new data is pushed and no readable
    // event gets emitted. We could certainly code around this
    // condition by always emitting a readable event when the
    // socket triggers it's readable event, but I think it's
    // better to make the call to _onReadable asynchronous.
    // Either could probably work though.
    setImmediate(this.handleReadable);
  };
}
