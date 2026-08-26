import { Clock, MapPin, ArrowRight } from "lucide-react";
import { demoEvents } from "../../data/demo";

export function Events() {
  const monthNames = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

  const upcoming = demoEvents
    .filter((e) => new Date(e.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return (
    <section className="ibbi-section ibbi-services-bg" id="eventos">
      <div className="ibbi-container">
        <span className="section-label">Eventos</span>
        <h2 className="section-title">
          Próximos eventos.
        </h2>

        {upcoming.length === 0 ? (
          <p className="section-subtitle">Novos eventos serão divulgados em breve.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 36 }}>
            {upcoming.map((event) => {
              const d = new Date(event.startDate);
              return (
                <div key={event.id} className="ibbi-event-card">
                  <div className="ibbi-event-card-img">
                    <img src={event.coverUrl} alt={event.title} loading="lazy" />
                    <div className="ibbi-event-date-badge">
                      <strong>{d.getDate()}</strong>
                      <span>{monthNames[d.getMonth()]}</span>
                    </div>
                  </div>
                  <div className="ibbi-event-card-body">
                    <h3>{event.title}</h3>
                    <div className="ibbi-event-meta">
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Clock size={14} /> {d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <MapPin size={14} /> {event.venueName}, {event.city}
                      </span>
                    </div>
                    <p>{event.description}</p>
                    <div>
                      <a href={`/evento/${event.slug}`} className="ibbi-btn ibbi-btn--primary ibbi-btn--small">
                        SAIBA MAIS <ArrowRight size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
