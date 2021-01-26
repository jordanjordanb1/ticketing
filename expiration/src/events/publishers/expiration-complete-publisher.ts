import { Publisher, ExpirationCompleteEvent, Subjects } from '@jordanjordanb-ticket/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
  
}
