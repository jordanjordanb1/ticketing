import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  try {
    console.log('Publisher connected to NATS');

    const publisher = new TicketCreatedPublisher(stan);

    await publisher.publish({
      id: '123',
      title: 'Test',
      price: 100,
      userId: 'wer2rf',
    });
  } catch (e) {
    console.error(e);
  }
});
