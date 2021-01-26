import { TicketCreatedEvent } from '@jordanjordanb-ticket/common';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.stan);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
  });

  await ticket.save();

  const data: TicketCreatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 999,
    userId: 'werwerw',
  };

  const msg: Partial<Message> = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg };
};

it('finds, updates, and saves the ticket', async () => {
  const { msg, data, listener, ticket } = await setup();

  await listener.onMessage(data, msg as Message);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toBe(data.title);
  expect(updatedTicket!.price).toBe(data.price);
  expect(updatedTicket!.version).toBe(data.version);
});

it('acks the message', async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg as Message);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version', async () => {
  const { msg, data, listener } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg as Message);
  } catch (e) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
