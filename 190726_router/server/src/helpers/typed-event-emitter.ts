/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from 'events';

/**
 * @class
 * @name TypedEventEmitter
 *
 * @description
 * Provides typing for an event emitters events and payloads
 *
 */
export class TypedEventEmitter<EventPayloadMap extends Record<string | symbol, any>> extends EventEmitter {
  /**
   * @description
   * Subscribe to an event ONCE with a callback
   *
   * @param event
   * @param listener
   */
  public once = <K extends Extract<keyof EventPayloadMap, string | symbol>>(
    event: K,
    listener: (payload: EventPayloadMap[K]) => any,
  ) => {
    return super.on(event, listener);
  };

  /**
   * @description
   * Subscribe to an event with a callback
   *
   * @param event
   * @param listener
   */
  public on = <K extends Extract<keyof EventPayloadMap, string | symbol>>(
    event: K,
    listener: (payload: EventPayloadMap[K]) => any,
  ) => {
    return super.on(event, listener);
  };

  /**
   * @description
   * Subscribe to an event with a callback
   *
   * @param event
   * @param listener
   */
  public addListener = <K extends Extract<keyof EventPayloadMap, string | symbol>>(
    event: K,
    listener: (payload: EventPayloadMap[K]) => any,
  ) => {
    return super.on(event, listener);
  };

  /**
   * @description
   * Fire an event with a payload
   *
   * @param event
   * @param payload
   */
  public emit = <K extends Extract<keyof EventPayloadMap, string | symbol>>(event: K, payload: EventPayloadMap[K]) => {
    return super.emit(event, payload);
  };
}
