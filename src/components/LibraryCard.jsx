import React from "react";

const LibraryCard = ({
  title,
  description,
  badges = [],
  progress,
  footer,
  onClick,
  className = "",
  compact = false,
  active = false,
  children,
}) => {
  const isClickable = typeof onClick === "function";
  const Component = "div";

  return (
    <Component
      className={`library-card ${compact ? "compact" : ""} ${active ? "active" : ""} ${isClickable ? "clickable" : ""} ${className}`.trim()}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
    >
      <div className="library-card-top">
        {badges.length > 0 && <div className="library-card-badges">{badges}</div>}
        {title && <h3 className="library-card-title">{title}</h3>}
        {description && <p className="library-card-description">{description}</p>}
        {children}
      </div>
      {typeof progress === "number" && (
        <div className="library-card-progress">
          <div className="progress-shell subtle">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-value">{progress}%</span>
        </div>
      )}
      {footer && <div className="library-card-footer">{footer}</div>}
    </Component>
  );
};

export default LibraryCard;
