import { CalendarDays, Users, Heart, MapPin } from "lucide-react";
import { siteConfig } from "../../data/siteConfig";
import { useEffect, useRef, useState } from "react";

const iconMap: Record<string, React.ReactNode> = {
  CalendarDays: <CalendarDays size={22} />,
  Users: <Users size={22} />,
  Heart: <Heart size={22} />,
  MapPin: <MapPin size={22} />,
};

export function QuickInfoCards() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="ibbi-quick-cards" ref={ref}>
      <div className="ibbi-quick-grid">
        {siteConfig.quickInfo.map((card, i) => (
          <div
            key={card.title}
            className="ibbi-quick-card"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: `all 0.5s ease ${0.15 * i}s`,
            }}
          >
            <div className="ibbi-quick-card-icon">
              {iconMap[card.icon]}
            </div>
            <div>
              <h3>{card.title}</h3>
              <p>{card.lines.join("\n")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
