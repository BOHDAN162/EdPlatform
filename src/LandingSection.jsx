import React from "react";
import LandingVisual from "./components/LandingVisual";

const LandingSection = ({ kicker, title, subtitle, bullets = [], steps = [], reverse = false, visual }) => {
  return (
    <section className={`landing-section ${reverse ? "reverse" : ""}`}>
      <div className="landing-section-inner">
        <div className="landing-copy">
          {kicker && <p className="landing-kicker">{kicker}</p>}
          <h2>{title}</h2>
          {subtitle && <p className="landing-subtitle">{subtitle}</p>}
          {steps.length > 0 && (
            <ol className="landing-steps">
              {steps.map((step, idx) => (
                <li key={idx}>
                  <span className="step-index">{idx + 1}</span>
                  <div>
                    <p className="step-title">{step.title}</p>
                    {step.description && <p className="step-desc">{step.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          )}
          {bullets.length > 0 && steps.length === 0 && (
            <ul className="landing-bullets">
              {bullets.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="landing-visual-wrapper" aria-hidden>
          <LandingVisual variant={visual} />
        </div>
      </div>
    </section>
  );
};

export default LandingSection;
