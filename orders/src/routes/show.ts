import { NotAuthorizedError, NotFoundError, requireAuth } from '@jordanjordanb-ticket/common';
import express from 'express';
import { Order } from '../models';

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  res.send(order);
});

export { router as showOrderRouter };
