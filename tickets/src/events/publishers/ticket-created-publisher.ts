import { Publisher, Subjects, TicketCreatedEvent } from '@jordanjordanb-ticket/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
