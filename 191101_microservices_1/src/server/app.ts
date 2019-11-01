import express from 'express';
import socketIo from 'socket.io';
import { ORDER_ROUTES } from '../shared/domains/orders/ORDER_ROUTES';

const app = express();
const io = socketIo(app);

const router = express.Router();

const data = {
  data: {
    hello: 'world'
  },
  meta: {}
};

router.get('/data', (req, res, next) => {
  res.status(200).json(data);
  next();
});

router
  .get(ORDER_ROUTES.INDEX.template)

io.on('connection', (socket) => {
  socket.on('')
});

// bind socketio to the app
app.use(router);
const PORT = 3000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
