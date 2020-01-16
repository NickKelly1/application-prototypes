import { sharedLogger } from '@nick-kelly/ts_composite_5__shared';
import { createServer } from 'http';
import { env } from './env';

sharedLogger('hello world :) this is being called from back-end/src/index.ts');

const server = createServer((req, res) => {
  console.log('received request...');
  const log = sharedLogger('input');
  res.write(log.join(', '));
  res.end();
});

server.listen(env.PORT);
console.log(`http server listening on port ${env.PORT}`);
