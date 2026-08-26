import { useEffect, useRef, useState } from "react";
import { siteConfig } from "../../data/siteConfig";

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="ibbi-section" id="sobre" ref={ref}>
      <div className="ibbi-container">
        <div className="ibbi-about-grid">
          <div
            className="ibbi-about-img"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-30px)",
              transition: "all 0.7s ease",
            }}
          >
            <img src="/hero-bg.jpg" alt={siteConfig.church.fullName} />
          </div>

          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(30px)",
              transition: "all 0.7s ease 0.2s",
            }}
          >
            <span className="section-label">Conheça a IBBI</span>
            <h2 className="section-title">
              Uma igreja.<br />Uma família.<br />Um propósito.
            </h2>
            <p className="section-subtitle">
              {siteConfig.about}
            </p>
            <a href="#contato" className="ibbi-btn ibbi-btn--primary" style={{ marginTop: 28 }}>
              Conheça Nossa História
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
