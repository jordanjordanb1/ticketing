import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus, Ticket } from '../../models';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'test title',
    price: 100,
  });

  await ticket.save();

  const user = global.getAuthCookie();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).send().expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toBe(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'test title',
    price: 100,
  });

  await ticket.save();

  const user = global.getAuthCookie();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).send().expect(204);

  expect(natsWrapper.stan.publish).toHaveBeenCalled();
});
