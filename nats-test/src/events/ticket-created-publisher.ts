import { Publisher, Subjects, TicketCreatedEvent } from '@jordanjordanb-ticket/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
