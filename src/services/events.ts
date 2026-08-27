import { demoEvents } from "../data/demo";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { Event } from "../types";

export async function listEvents(): Promise<Event[]> {
  if (!isSupabaseConfigured || !supabase) return demoEvents;
  const { data, error } = await supabase.from("events").select("*, ticket_types(*, ticket_batches(*))").eq("status", "published");
  if (error || !data) return demoEvents;
  return data.map(mapEvent);
}

export async function getEvent(slug: string): Promise<Event | undefined> {
  const events = await listEvents();
  return events.find((event) => event.slug === slug);
}

function mapEvent(row: any): Event {
  const batches = (row.ticket_types ?? []).flatMap((type: any) =>
    (type.ticket_batches ?? []).map((batch: any) => ({
      id: batch.id,
      ticketTypeId: type.id,
      ticketTypeName: type.name,
      name: batch.name,
      description: batch.description,
      price: Number(batch.price),
      quantity: batch.quantity,
      quantitySold: batch.quantity_sold,
      maxPerOrder: batch.max_per_order,
      salesStart: batch.sales_start,
      salesEnd: batch.sales_end,
      status: batch.status
    }))
  );
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    category: row.category,
    coverUrl: row.cover_url,
    mobileCoverUrl: row.mobile_cover_url,
    startDate: row.start_date,
    endDate: row.end_date,
    venueName: row.venue_name,
    address: row.address,
    city: row.city,
    state: row.state,
    ageRating: row.age_rating,
    status: row.status,
    visibility: row.visibility,
    organizer: row.organizer_name ?? "Organizador",
    batches
  };
}
