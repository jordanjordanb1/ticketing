import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Test Ticket',
    price: 20,
  });

  await ticket.save();

  return ticket;
};

it('fetches an order for a particular user', async () => {
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = global.getAuthCookie();
  const userTwo = global.getAuthCookie();

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({
      ticketId: ticketOne.id,
    })
    .expect(201);

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      ticketId: ticketTwo.id,
    })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      ticketId: ticketThree.id,
    })
    .expect(201);

  const response = await request(app).get('/api/orders').set('Cookie', userTwo).expect(200);

  expect(response.body.length).toBe(2);
  expect(response.body[0].id).toBe(orderOne.id);
  expect(response.body[1].id).toBe(orderTwo.id);
  expect(response.body[0].ticket.id).toBe(ticketTwo.id);
  expect(response.body[1].ticket.id).toBe(ticketThree.id);
});
