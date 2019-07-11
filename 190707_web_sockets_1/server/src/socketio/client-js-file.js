console.log('hello world', Date.now());

const socket = io();

io().on('connection', socket => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
