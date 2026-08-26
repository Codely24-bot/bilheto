import { galleryImages } from "../../data/media";

export function Gallery() {
  return (
    <section className="ibbi-section ibbi-services-bg" id="galeria">
      <div className="ibbi-container">
        <span className="section-label">Galeria</span>
        <h2 className="section-title">
          Nossa<br />comunidade.
        </h2>

        <div className="ibbi-gallery-grid">
          {galleryImages.map((img) => (
            <div
              key={img.id}
              className={`ibbi-gallery-item ${img.size === "large" ? "ibbi-gallery-item--large" : ""}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%230D171B' width='600' height='400'/%3E%3C/svg%3E";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
