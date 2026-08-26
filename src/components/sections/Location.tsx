import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { siteConfig } from "../../data/siteConfig";

export function Location() {
  const servicesText = siteConfig.serviceTimes
    .map((s) => `${s.day}: ${s.label} às ${s.time}`)
    .join("\n");

  return (
    <section className="ibbi-section" id="localizacao">
      <div className="ibbi-container">
        <span className="section-label">Localização</span>
        <h2 className="section-title">
          Visite-nos.
        </h2>

        <div className="ibbi-location-grid" style={{ marginTop: 36 }}>
          <div className="ibbi-location-info">
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 700 }}>{siteConfig.church.fullName}</h3>
              <p style={{ fontSize: 13, color: "var(--gold)", marginTop: 4 }}>{siteConfig.church.subtitle}</p>
            </div>

            <div className="ibbi-location-info-item">
              <div className="ibbi-location-info-icon"><MapPin size={18} /></div>
              <div className="ibbi-location-info-text">
                <h4>Endereço</h4>
                <p>{siteConfig.address.full}</p>
              </div>
            </div>

            {siteConfig.contact.phone && (
              <div className="ibbi-location-info-item">
                <div className="ibbi-location-info-icon"><Phone size={18} /></div>
                <div className="ibbi-location-info-text">
                  <h4>Telefone</h4>
                  <p>{siteConfig.contact.phone}</p>
                </div>
              </div>
            )}

            {siteConfig.contact.email && (
              <div className="ibbi-location-info-item">
                <div className="ibbi-location-info-icon"><Mail size={18} /></div>
                <div className="ibbi-location-info-text">
                  <h4>E-mail</h4>
                  <p>{siteConfig.contact.email}</p>
                </div>
              </div>
            )}

            <div className="ibbi-location-info-item">
              <div className="ibbi-location-info-icon"><Clock size={18} /></div>
              <div className="ibbi-location-info-text">
                <h4>Horários dos Cultos</h4>
                <p style={{ whiteSpace: "pre-line" }}>{servicesText}</p>
              </div>
            </div>

            <a
              href={siteConfig.address.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ibbi-btn ibbi-btn--primary"
              style={{ marginTop: 8 }}
            >
              TRAÇAR ROTA <ArrowRight size={18} />
            </a>
          </div>

          <div className="ibbi-location-map">
            <iframe
              title={`Mapa - ${siteConfig.church.fullName}`}
              src={siteConfig.address.embedUrl}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
