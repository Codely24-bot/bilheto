import { ArrowRight } from "lucide-react";
import { ministries } from "../../data/ministries";

export function Ministries() {
  return (
    <section className="ibbi-section" id="ministerios">
      <div className="ibbi-container">
        <span className="section-label">Ministérios</span>
        <h2 className="section-title">
          Para toda<br />a família.
        </h2>
        <p className="section-subtitle">
          Há um lugar para você e sua família na IBBI.
        </p>

        <div className="ibbi-ministry-grid">
          {ministries.map((m) => (
            <div key={m.id} className="ibbi-ministry-card">
              <img
                src={m.image}
                alt={m.name}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260'%3E%3Crect fill='%230D171B' width='400' height='260'/%3E%3Ctext fill='%23A6ADAF' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E" + m.name + "%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="ibbi-ministry-card-overlay">
                <div className="ibbi-ministry-card-arrow">
                  <ArrowRight size={16} />
                </div>
                <h3>{m.name}</h3>
                <p>{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
