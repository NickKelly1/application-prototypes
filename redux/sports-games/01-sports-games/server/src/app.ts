import http, { IncomingMessage, ServerResponse } from 'http';

const PORT = 3050;

console.log('hello world12');

const server = http.createServer((req: IncomingMessage, res: ServerResponse): void => {
  res.write('hello world!'); // write a response
  res.end();
});

server.listen(PORT, (): void => {
  console.log('Server started at port 3000'); // server object
});
