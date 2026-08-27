import { Heart, MapPin } from "lucide-react";
import type { MouseEvent } from "react";
import { brl, shortDate } from "../../lib/format";
import type { Event } from "../../types";

export function EventCard({ event }: { event: Event }) {
  const minPrice = Math.min(...event.batches.map((batch) => batch.price));
  const favorite = (action: MouseEvent) => {
    action.preventDefault();
    action.stopPropagation();
    localStorage.setItem(`favorite_${event.id}`, "true");
    alert("Evento adicionado aos favoritos.");
  };
  return <a className="card event-card" href={`/evento/${event.slug}`} style={{ display: "block", overflow: "hidden", background: "var(--surface)" }}>
    <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "#0b0b0b", display: "grid", placeItems: "center" }}>
      <img src={event.posterUrl ?? event.coverUrl} alt={event.title} style={{ maxWidth: "78%", maxHeight: "88%", width: "auto", height: "auto", objectFit: "contain" }} />
      <button className="btn btn-ghost" aria-label="Favoritar" onClick={favorite} style={{ position: "absolute", right: 12, top: 12, width: 40, height: 40, padding: 0, borderRadius: 999 }}><Heart size={18} /></button>
      <div style={{ position: "absolute", left: 12, bottom: 12, background: "#ffffff", color: "#000000", borderRadius: 6, padding: "8px 10px", textAlign: "center", fontWeight: 950 }}>{shortDate(event.startDate)}</div>
    </div>
    <div style={{ padding: 18, textAlign: "center" }}>
      <p className="badge" style={{ display: "inline-flex", background: "rgb(255 255 255 / .08)", color: "#ffffff", border: "1px solid var(--border)", margin: "0 0 12px" }}>{event.category}</p>
      <h3 style={{ margin: "0 0 10px", fontSize: 20, lineHeight: 1.15 }}>{event.title}</h3>
      <p className="muted" style={{ margin: 0, display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}><MapPin size={16} />{event.venueName}, {event.city} - {event.state}</p>
      <p style={{ margin: "16px 0 0", fontWeight: 950, color: "var(--primary)" }}>A partir de {brl(minPrice)}</p>
    </div>
  </a>;
}
