import { Clock, ArrowRight } from "lucide-react";
import { siteConfig } from "../../data/siteConfig";

export function Services() {
  const getServiceName = (day: string) => day === "Terça-feira" ? "Culto Rio da Vida" : "Culto de Celebração";

  return (
    <section className="ibbi-section ibbi-services-bg" id="cultos">
      <div className="ibbi-container">
        <span className="section-label">Encontre seu lugar</span>
        <h2 className="section-title">
          Venha cultuar<br />conosco.
        </h2>

        <div className="ibbi-services-grid">
          {siteConfig.serviceTimes.map((s, i) => (
            <div key={i} className="ibbi-service-card">
              <span className="ibbi-service-card-day">{s.day}</span>
              <h3>{getServiceName(s.day)}</h3>
              <div className="ibbi-service-card-time">
                <Clock size={20} /> {s.time}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 36, textAlign: "center" }}>
          <a
            href={siteConfig.address.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ibbi-btn ibbi-btn--primary"
          >
            COMO CHEGAR <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
