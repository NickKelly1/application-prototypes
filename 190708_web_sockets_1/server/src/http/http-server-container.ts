import http from 'http';
import express from 'express';

/**
 * @class
 * @name HttpServer
 *
 * @description
 * Wrapper for an Express Http Server (http.createServer(express))
 */
export class HttpServerContainer {
  private _httpServer: http.Server;

  /**
   * @constructor
   */
  public constructor() {
    this._httpServer = http.createServer(express());
  }

  /**
   * @description
   * Get the internal server that can be bound to
   */
  public get httpServer() {
    return this._httpServer;
  }
}
