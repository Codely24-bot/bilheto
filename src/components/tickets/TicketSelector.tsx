import { Minus, Plus } from "lucide-react";
import { brl } from "../../lib/format";
import type { CartLine, Event } from "../../types";

export function TicketSelector({ event, items, onChange }: { event: Event; items: CartLine[]; onChange: (items: CartLine[]) => void }) {
  const setQty = (batchId: string, quantity: number) => {
    const clean = Math.max(0, quantity);
    const next = items.filter((item) => item.batchId !== batchId);
    if (clean > 0) next.push({ batchId, quantity: clean });
    onChange(next);
  };
  return <div style={{ display: "grid", gap: 12 }}>
    {event.batches.map((batch) => {
      const selected = items.find((item) => item.batchId === batch.id)?.quantity ?? 0;
      const available = batch.quantity - batch.quantitySold;
      const disabled = available <= 0 || batch.status !== "available";
      return <div key={batch.id} className={`ibbi-ticket-card ${selected ? "ibbi-ticket-card--selected" : ""}`}>
        <div className="ibbi-ticket-header">
          <div>
            <div className="ibbi-ticket-name">{batch.ticketTypeName}</div>
            <div className="ibbi-ticket-detail">{batch.name} | {disabled ? "ESGOTADO" : `${available} disponíveis`}</div>
          </div>
          <span className="ibbi-ticket-price">{brl(batch.price)}</span>
        </div>
        <div className="ibbi-ticket-controls">
          <button className="ibbi-ticket-btn" disabled={selected === 0} onClick={() => setQty(batch.id, selected - 1)}><Minus size={16} /></button>
          <span className="ibbi-ticket-qty">{selected}</span>
          <button className="ibbi-ticket-btn" disabled={disabled || selected >= batch.maxPerOrder || selected >= available} onClick={() => setQty(batch.id, selected + 1)}><Plus size={16} /></button>
        </div>
      </div>;
    })}
  </div>;
}
