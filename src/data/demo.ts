import type { Event, Order, Ticket } from "../types";
import { testClientEmail } from "../lib/localUsers";

export const demoEvents: Event[] = [
  {
    id: "evt_aprendendo_a_ser_parceiros",
    title: "Aprendendo a Ser Parceiros",
    slug: "aprendendo-a-ser-parceiros",
    description:
      "Um encontro especial para casais que desejam crescer juntos, fortalecer a comunhão e aprender na prática a ser verdadeiros parceiros de vida.",
    category: "Workshops",
    coverUrl: "/evento-parceiros.jpg",
    mobileCoverUrl: "/evento-parceiros.jpg",
    posterUrl: "/evento-parceiros.jpg",
    startDate: "2026-10-19T19:00:00-03:00",
    endDate: "2026-10-19T22:00:00-03:00",
    venueName: "IBBI – Igreja Batista do Bairro Industrial",
    address: "R. Dom Bosco, 197 – Bairro Industrial, Contagem – MG",
    city: "Contagem",
    state: "MG",
    ageRating: "Livre",
    status: "published",
    visibility: "public",
    organizer: "IBBI",
    batches: [
      {
        id: "batch_parceiros_1",
        ticketTypeId: "type_casal",
        ticketTypeName: "CASAL",
        name: "Lote único",
        description: "Ingresso para um casal",
        price: 100,
        quantity: 100,
        quantitySold: 0,
        maxPerOrder: 2,
        salesStart: "2026-08-21T09:00:00-03:00",
        salesEnd: "2026-10-19T18:00:00-03:00",
        status: "available"
      }
    ]
  }
];

export const demoOrders: Order[] = [
  {
    id: "ORD-1001",
    eventId: "evt_aprendendo_a_ser_parceiros",
    buyerName: "Victor Dsouza Jr",
    buyerEmail: testClientEmail,
    buyerCpf: "***.123.***-09",
    buyerPhone: "(31) 99999-0101",
    items: [{ batchId: "batch_parceiros_1", quantity: 1 }],
    subtotal: 100,
    discount: 0,
    fee: 0,
    total: 100,
    paymentStatus: "approved",
    status: "paid"
  }
];

export const demoTickets: Ticket[] = [
  {
    token: "tk_parceiros_secure_abc12xyz98",
    code: "CASAL-001",
    eventTitle: "Aprendendo a Ser Parceiros",
    attendeeName: "Victor Dsouza Jr",
    ticketType: "CASAL",
    batchName: "Lote único",
    date: "19 out 2026, 19:00",
    venue: "Igreja Rio da Vida",
    status: "valid",
    checkedIn: false
  }
];
