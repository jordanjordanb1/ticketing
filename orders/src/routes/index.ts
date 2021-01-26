import { requireAuth } from '@jordanjordanb-ticket/common';
import express from 'express';
import { Order } from '../models';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req, res, next) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate('ticket');

  res.send(orders);
});

export { router as indexOrderRouter };
