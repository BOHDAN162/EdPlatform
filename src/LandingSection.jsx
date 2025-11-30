import React from "react";

const LandingSection = ({ title, subtitle, bullets = [], reverse = false, kicker, childrenIllustration, children }) => {
  return (
    <section className={`landing-section ${reverse ? "reverse" : ""}`}>
      <div className="landing-text">
        {kicker && <p className="landing-kicker">{kicker}</p>}
        <h2 className="landing-title">{title}</h2>
        {subtitle && <p className="landing-subtitle">{subtitle}</p>}
        {bullets.length > 0 && (
          <ul className="landing-bullets">
            {bullets.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
        {children}
      </div>
      <div className="landing-visual" aria-hidden>
        {childrenIllustration}
      </div>
    </section>
  );
};

export default LandingSection;
