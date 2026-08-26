import { useEffect, useState } from "react";
import { Menu, X, Heart } from "lucide-react";
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
          </nav>

          <div className="ibbi-header-cta desktop-only">
            <a href="#contato" className="ibbi-btn ibbi-btn--primary ibbi-btn--small">
              <Heart size={15} /> Seja Bem-Vindo
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
        </nav>
        <div className="ibbi-mobile-menu-footer ibbi-container">
          <a href="#contato" className="ibbi-btn ibbi-btn--primary ibbi-btn--full" onClick={() => setMobileOpen(false)}>
            <Heart size={16} /> Seja Bem-Vindo
          </a>
        </div>
      </div>
    </>
  );
}
