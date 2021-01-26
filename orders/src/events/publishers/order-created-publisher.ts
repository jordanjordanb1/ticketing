import { Publisher, OrderCreatedEvent, Subjects } from '@jordanjordanb-ticket/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
