import type { Event, Order, Ticket } from "../types";
import { testClientEmail } from "../lib/localUsers";

export const demoEvents: Event[] = [
  {
    id: "00000000-0000-0000-0000-000000000101",
    title: "Aprendendo a Ser Parceiros",
    slug: "aprendendo-a-ser-parceiros",
    description:
      "Um encontro especial para casais que desejam crescer juntos, fortalecer a comunhão e aprender na prática a construir uma parceria verdadeira para a vida. Será uma noite de conexão, aprendizado e renovação, com uma palavra para fortalecer o relacionamento e a caminhada a dois.\n\nProgramação\n\n• Recepção e acolhimento dos casais\n• Palestra: Aprendendo a Ser Parceiros - Pastor Ronaldo Morais e Mariza Morais\n• Jantar especial para os casais\n• Momento de comunhão e conexão\n\nImportante: Este é um evento exclusivo para casais. Não será permitida a participação de crianças.",
    category: "Oficinas",
    coverUrl: "/evento-parceiros.jpg",
    mobileCoverUrl: "/evento-parceiros.jpg",
    posterUrl: "/evento-parceiros.jpg",
    startDate: "2026-09-19T19:00:00-03:00",
    endDate: "2026-09-19T22:00:00-03:00",
    venueName: "IBBI – Igreja Batista do Bairro Industrial",
    address: "R. Nascimento Teixeira, 660 - Industrial, Contagem - MG, 32235-300, Brasil",
    city: "Contagem",
    state: "MG",
    ageRating: "Livre",
    status: "published",
    visibility: "public",
    organizer: "IBBI",
    batches: [
      {
        id: "00000000-0000-0000-0000-000000000301",
        ticketTypeId: "type_casal",
        ticketTypeName: "CASAL",
        name: "Lote único",
        description: "Ingresso para um casal",
        price: 100,
        quantity: 70,
        quantitySold: 0,
        maxPerOrder: 1,
        salesStart: "2026-08-21T09:00:00-03:00",
        salesEnd: "2026-09-19T18:00:00-03:00",
        status: "available"
      }
    ]
  }
];

export const demoOrders: Order[] = [
  {
    id: "ORD-1001",
    eventId: "00000000-0000-0000-0000-000000000101",
    buyerName: "Victor e Juliana",
    buyerEmail: testClientEmail,
    buyerCpf: "***.123.***-09",
    buyerPhone: "(31) 99999-0101",
    items: [{ batchId: "00000000-0000-0000-0000-000000000301", quantity: 1 }],
    subtotal: 1,
    discount: 0,
    fee: 0.1,
    total: 1.1,
    paymentStatus: "approved",
    status: "paid"
  }
];

export const demoTickets: Ticket[] = [
  {
    token: "tk_parceiros_secure_abc12xyz98",
    code: "CASAL-001",
    eventTitle: "Aprendendo a Ser Parceiros",
    attendeeName: "Victor e Juliana",
    ticketType: "CASAL",
    batchName: "Lote único",
date: "19 set 2026, 19:00",
    venue: "IBBI – Igreja Batista do Bairro Industrial — R. Nascimento Teixeira, 660 - Industrial, Contagem - MG, 32235-300, Brasil",
    status: "valid",
    checkedIn: false
  }
];
