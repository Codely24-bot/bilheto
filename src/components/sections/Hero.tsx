import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { siteConfig } from "../../data/siteConfig";

export function Hero() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 250);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      el.style.setProperty("--parallax", `${window.scrollY * 0.35}px`);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="ibbi-hero" id="inicio" ref={ref}>
      <div className="ibbi-hero-bg">
        <img src="/hero-sobre.jpg" alt={siteConfig.church.fullName} style={{ transform: "translateY(var(--parallax, 0))" }} />
      </div>
      <div className="ibbi-hero-overlay" />

      <div className={`ibbi-hero-content ${visible ? "ibbi-hero--visible" : ""}`}>
        <span className="ibbi-hero-year">
          {siteConfig.yearTheme.label} {siteConfig.yearTheme.year}
        </span>

        <h1 className="ibbi-hero-title">
          <span className="ibbi-hero-word">{siteConfig.yearTheme.line1}</span>
          <span className="ibbi-hero-word ibbi-hero-word--gold">{siteConfig.yearTheme.line2}</span>
          <span className="ibbi-hero-word">{siteConfig.yearTheme.line3}</span>
        </h1>

        <div className="ibbi-hero-divider">
          <span className="ibbi-hero-divider-line" />
          <span style={{ fontSize: 14 }}>♥</span>
          <span className="ibbi-hero-divider-line" />
        </div>

        <p className="ibbi-hero-text">{siteConfig.church.description}</p>

        <div className="ibbi-hero-actions">
          <button className="ibbi-btn ibbi-btn--primary" onClick={() => scrollTo("sobre")}>
            CONHEÇA MAIS <ArrowRight size={18} />
          </button>
          <button className="ibbi-btn ibbi-btn--outline" onClick={() => scrollTo("midia")}>
            <Play size={16} fill="currentColor" /> ASSISTA AO VÍDEO
          </button>
        </div>
      </div>
    </section>
  );
}
