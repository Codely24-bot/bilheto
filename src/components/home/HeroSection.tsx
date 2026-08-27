import { Play, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function HeroSection() {
  const [visible, setVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY;
      el.style.setProperty("--parallax", `${y * 0.35}px`);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-bg">
        <img src="/hero-bg.jpg" alt="IBBI Rio da Vida" className="hero-bg-img" />
      </div>

      <div className="hero-overlay" />

      <div className={`hero-content ${visible ? "hero-content--visible" : ""}`}>
        <span className="hero-label">TEMA DO ANO</span>

        <h1 className="hero-title">
          <span className="hero-title-word hero-title-word--1">QUERER</span>
          <span className="hero-title-word hero-title-word--2">INSPIRA</span>
          <span className="hero-title-word hero-title-word--3">REALIZAR</span>
        </h1>

        <p className="hero-subtitle">
          Uma igreja que vive o amor de Cristo,<br />
          serve com alegria e anuncia o Reino de Deus.
        </p>

        <div className="hero-actions">
          <a href="#eventos" className="hero-btn hero-btn--primary">
            CONHEÇA MAIS <ArrowRight size={18} />
          </a>
          <a href="#video" className="hero-btn hero-btn--secondary">
            <Play size={16} fill="currentColor" /> ASSISTA AO VÍDEO
          </a>
        </div>
      </div>
    </section>
  );
}
