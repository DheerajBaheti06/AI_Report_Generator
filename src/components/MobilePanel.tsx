import React from "react";

export const MobilePanel: React.FC<{
  panel: "format" | "header" | "export" | null;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ panel, onClose, title, children }) => {
  if (!panel) return null;

  return (
    <div className="mobile-format-panel-overlay" onClick={onClose}>
      <div
        className={`mobile-format-panel ${panel ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobile-panel-header">
          <h3>{title}</h3>
          <button className="close-panel-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="mobile-panel-content">{children}</div>
      </div>
    </div>
  );
};
