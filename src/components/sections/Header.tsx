import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "../../data/siteConfig";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header className={`ibbi-header ${scrolled ? "ibbi-header--scrolled" : ""}`}>
        <div className="ibbi-container ibbi-header-inner">
          <a href="#inicio" className="ibbi-logo">
            <img src="/logo-casa-ibbi.svg" alt={siteConfig.church.fullName} />
          </a>

          <nav className="ibbi-nav">
            {siteConfig.nav.map((item) => (
              <a key={item.href} href={item.href}>{item.label}</a>
            ))}
            <a href="/doacoes" className="ibbi-nav-donate">Doações</a>
          </nav>

          <div className="ibbi-header-cta desktop-only">
            <a href="/login" className="ibbi-btn ibbi-btn--primary ibbi-btn--small">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              Seja bem-vindo
            </a>
          </div>

          <button className="ibbi-mobile-toggle" onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>
        </div>
      </header>

      <div className={`ibbi-mobile-menu ${mobileOpen ? "ibbi-mobile-menu--open" : ""}`}>
        <div className="ibbi-mobile-menu-header ibbi-container">
          <a href="#inicio" className="ibbi-logo" onClick={() => setMobileOpen(false)}>
            <img src="/logo-casa-ibbi.svg" alt={siteConfig.church.fullName} />
          </a>
          <button onClick={() => setMobileOpen(false)} aria-label="Fechar menu" style={{ color: "var(--white)", cursor: "pointer" }}>
            <X size={24} />
          </button>
        </div>
        <nav className="ibbi-mobile-nav ibbi-container">
          {siteConfig.nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>{item.label}</a>
          ))}
          <a href="/doacoes" onClick={() => setMobileOpen(false)}>Doações</a>
        </nav>
        <div className="ibbi-mobile-menu-footer ibbi-container">
          <a href="/login" className="ibbi-btn ibbi-btn--primary ibbi-btn--full" onClick={() => setMobileOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            Seja bem-vindo
          </a>
        </div>
      </div>
    </>
  );
}
