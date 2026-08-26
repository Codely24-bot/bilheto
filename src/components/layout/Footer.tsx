export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="/" className="footer-logo" aria-label="Casa IBBI">
              <img src="/logo-casa-ibbi.svg" alt="Casa IBBI" />
            </a>
            <p className="footer-tagline">
              Venda e gerencie ingressos com segurança, velocidade e uma experiência elegante.
            </p>
            <div className="footer-socials">
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Navegação</h4>
            <a href="/">Agenda</a>
            <a href="/meus-ingressos">Meus ingressos</a>
            <a href="/admin">Painel do produtor</a>
          </div>

          <div className="footer-links">
            <h4>Institucional</h4>
            <span>Termos de uso</span>
            <span>Privacidade</span>
            <span>Cancelamento</span>
          </div>

          <div className="footer-address">
            <h4>Localização</h4>
            <address>
              Bairro Industrial<br />
              Contagem/MG
            </address>
            <div className="footer-map">
              <iframe
                title="Mapa da localização"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3750.8!2d-44.0364271!3d-19.9754864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa6be421d813c31%3A0xdcec19086c1ea259!2sIgreja%20Batista%20do%20Bairro%20Industrial!5e0!3m2!1spt-BR!2sbr!4v1"
                width="100%"
                height="180"
                style={{ border: 0, borderRadius: 6 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Casa IBBI. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
