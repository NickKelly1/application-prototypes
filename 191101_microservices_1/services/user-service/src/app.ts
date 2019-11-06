import http from 'http';
import express from 'express';
import cors from 'cors';
import socketIo, {Client} from 'socket.io';
import { Kafka } from 'kafkajs';

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
const io = socketIo(httpServer, {origins: '*:*'});
const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('tryna serve stuff...................');
  res.status(200).json({hello: 'mate'});
  next();
});

let clientCount = 0;

io.on('connection', (socket) => {
  clientCount += 1;
  console.log(`[app::io::on] client ${clientCount} connected`);
});

const PORT = 4000;

app.use(router);
app.listen(PORT, () => console.log(`listening on port ${PORT}`));

// const kafka = new Kafka({
//   clientId: 'my-app',
//   brokers: ['localhost:9092']
// });

// const producer = kafka.producer();
// const consumer = kafka.consumer({ groupId: 'testgroup' });

// const topic = 'testtopic';

// async function connectKafka() {
//   // producing
//   await producer
//     .connect()
//     .then(() => producer.send({
//       topic: topic,
//       messages: [ { value: 'Hello KafkaJS user!' } ]
//     }));

//   // consuming
//   await consumer
//     .connect()
//     .then(() => consumer.subscribe({ topic: topic, fromBeginning: true  }))
//     .then(() => consumer.run({
//       eachMessage: async function handleMessage({ message, partition, topic }) {
//         console.log('[consumer::handleMessage]', {
//           partition,
//           offset: message.offset,
//           value: message.value.toString(),
//         })
//       }
//     }));

//   console.log('Finished connecting to kafka...');
// }


// console.log('Connecting to kafka...');
// connectKafka();

