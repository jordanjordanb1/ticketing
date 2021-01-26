import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from '.';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;

  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema<TicketDoc>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    versionKey: 'version',
    toJSON: {
      transform(_doc, ret: TicketDoc) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = function ({ id, ...rest }: TicketAttrs): TicketDoc {
  return new Ticket({
    _id: id,
    ...rest,
  });
};

ticketSchema.statics.findByEvent = async function (event: { id: any; version: number }): Promise<TicketDoc | null> {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

ticketSchema.methods.isReserved = async function () {
  const ticket = this;

  const existingOrder = await Order.findOne({
    ticket: ticket,
    status: {
      $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
