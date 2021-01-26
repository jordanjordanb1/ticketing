import { Publisher, Subjects, OrderCancelledEvent } from '@jordanjordanb-ticket/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
