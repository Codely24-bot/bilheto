export type BatchStatus = "draft" | "scheduled" | "available" | "sold_out" | "closed";
export type PaymentStatus = "pending" | "approved" | "rejected" | "cancelled" | "refunded" | "chargeback";
export type TicketStatus = "valid" | "used" | "cancelled" | "refunded";

export type TicketBatch = {
  id: string;
  ticketTypeId: string;
  ticketTypeName: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  quantitySold: number;
  maxPerOrder: number;
  salesStart: string;
  salesEnd: string;
  status: BatchStatus;
};

export type Event = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  coverUrl: string;
  mobileCoverUrl: string;
  posterUrl?: string;
  startDate: string;
  endDate: string;
  venueName: string;
  address: string;
  city: string;
  state: string;
  ageRating: string;
  status: "draft" | "published" | "sold_out" | "cancelled";
  visibility: "public" | "private";
  organizer: string;
  batches: TicketBatch[];
};

export type CartLine = { batchId: string; quantity: number };
export type Order = {
  id: string;
  eventId: string;
  buyerName: string;
  buyerEmail: string;
  buyerCpf: string;
  buyerPhone: string;
  items: CartLine[];
  subtotal: number;
  discount: number;
  fee: number;
  total: number;
  paymentStatus: PaymentStatus;
  status: "open" | "paid" | "cancelled" | "expired";
};

export type Ticket = {
  token: string;
  code: string;
  eventTitle: string;
  attendeeName: string;
  ticketType: string;
  batchName: string;
  date: string;
  venue: string;
  status: TicketStatus;
  checkedIn: boolean;
  checkedInAt?: string;
};
