import { brl } from "../../lib/format";
import type { Event } from "../../types";

export function TicketSelector({ event }: { event: Event }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {event.batches.map((batch) => {
        const available = batch.quantity - batch.quantitySold;
        const disabled = available <= 0 || batch.status !== "available";
        return (
          <div key={batch.id} className={`ibbi-ticket-card ${disabled ? "" : "ibbi-ticket-card--selected"}`}>
            <div className="ibbi-ticket-header">
              <div>
                <div className="ibbi-ticket-name">{batch.ticketTypeName}</div>
                <div className="ibbi-ticket-detail">{disabled ? "ESGOTADO" : "1 ingresso por casal"}</div>
              </div>
              <span className="ibbi-ticket-price">{brl(batch.price)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}