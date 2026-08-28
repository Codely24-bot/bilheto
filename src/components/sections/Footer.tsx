import { siteConfig } from "../../data/siteConfig";

export function Footer() {
  return (
    <footer className="ibbi-footer">
      <div className="ibbi-container">
        <div className="ibbi-footer-grid">
          <div className="ibbi-footer-brand">
            <a href="#inicio" className="ibbi-logo">
              <img src="/logo-casa-ibbi.svg" alt={siteConfig.church.fullName} style={{ height: 40 }} />
            </a>
            <p>{siteConfig.church.description}</p>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              {siteConfig.social.instagram && (
                <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,.06)", transition: "background 0.2s" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
              )}
              {siteConfig.social.youtube && (
                <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                  style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,.06)", transition: "background 0.2s" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                </a>
              )}
              {siteConfig.social.facebook && (
                <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,.06)", transition: "background 0.2s" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              )}
            </div>
          </div>

          <div className="ibbi-footer-col">
            <h4>Igreja</h4>
            <a href="#sobre">Sobre nós</a>
            <a href="#sobre">Nossa história</a>
            <a href="#ministerios">Ministérios</a>
            <a href="#cultos">Cultos</a>
          </div>

          <div className="ibbi-footer-col">
            <h4>Conecte-se</h4>
            <a href="#eventos">Eventos</a>
            <a href="#midia">Mídia</a>
            <a href="#contato">Contato</a>
          </div>

          <div className="ibbi-footer-col">
            <h4>Informações</h4>
            <a href={siteConfig.address.googleMapsUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              {siteConfig.address.full}
            </a>
            {siteConfig.contact.phone && <span>{siteConfig.contact.phone}</span>}
            {siteConfig.contact.email && <span>{siteConfig.contact.email}</span>}
            <div style={{ marginTop: 10 }}>
              <iframe
                title="Mapa da localização"
                src={siteConfig.address.embedUrl}
                width="100%"
                height="150"
                style={{ border: 0, borderRadius: 6 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div className="ibbi-footer-bottom">
          <p>© {new Date().getFullYear()} {siteConfig.church.fullName}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
