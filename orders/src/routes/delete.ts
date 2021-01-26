import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@jordanjordanb-ticket/common';
import express from 'express';
import { OrderCancelledPublisher } from '../events/publishers';
import { Order } from '../models';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  order.set('status', OrderStatus.Cancelled);

  await order.save();

  new OrderCancelledPublisher(natsWrapper.stan).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id,
    },
    version: order.version,
  });

  res.status(204).send(order);
});

export { router as deleteOrderRouter };
