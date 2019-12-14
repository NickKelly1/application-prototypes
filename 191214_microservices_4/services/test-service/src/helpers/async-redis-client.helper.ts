import { RedisClient, ClientOpts } from "redis";
import { promisify } from 'util';


export class AsyncRedisClient extends RedisClient {
  constructor(opts: ClientOpts) {
    super(opts);
  }

  asyncGET(key: string) { return promisify(this.GET).bind(this)(key) }
  asyncPING() { return promisify(this.PING).bind(this)() }
}
