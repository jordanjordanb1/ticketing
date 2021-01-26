import { Publisher, Subjects, TicketUpdatedEvent } from '@jordanjordanb-ticket/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
