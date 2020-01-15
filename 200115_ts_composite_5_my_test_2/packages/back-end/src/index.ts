import { sharedLogger } from '@nick-kelly/ts_composite_5__shared';
import { createServer } from 'http';

sharedLogger('hello world :) this is being called from back-end/src/index.ts');

const http = createServer((req, res) => {
  console.log('received request...');
  const log = sharedLogger('input');
  res.write(log.join(', '));
  res.end();
});

const port = 3000;
http.listen(port);
console.log(`http server listening on port ${port}`);
