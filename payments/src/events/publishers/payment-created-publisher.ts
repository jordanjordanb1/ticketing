import { Subjects, Publisher, PaymentCreatedEvent } from '@jordanjordanb-ticket/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
