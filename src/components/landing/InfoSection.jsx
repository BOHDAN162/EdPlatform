import React, { useEffect, useRef, useState } from "react";

const InfoSection = ({
  id,
  accentLabel,
  title,
  subtitle,
  bullets,
  comparison,
  textSide = "left",
  backgroundVariant = "default",
  visual,
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setVisible(true);
      return () => {};
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`info-section ${textSide === "right" ? "reverse" : ""} ${backgroundVariant === "alt" ? "alt" : ""} ${
        visible ? "visible" : ""
      }`}
    >
      <div className="info-text">
        {accentLabel && <p className="accent-label">{accentLabel}</p>}
        <h2>{title}</h2>
        <p className="meta large">{subtitle}</p>
        {bullets && (
          <ul className="info-bullets">
            {bullets.map((item) => (
              <li key={item}>
                <span className="pill-dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
        {comparison && (
          <div className="change-list">
            {comparison.map((row) => (
              <div key={row.before} className="change-row">
                <div className="change-card before">
                  <span className="badge subtle">До</span>
                  <p>{row.before}</p>
                </div>
                <div className="change-card after">
                  <span className="badge accent">После</span>
                  <p>{row.after}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="info-visual">{visual}</div>
    </section>
  );
};

export default InfoSection;
