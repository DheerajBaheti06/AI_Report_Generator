import React from "react";

export const IconButton = React.forwardRef<
  HTMLButtonElement,
  {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
    className?: string;
    type?: "button" | "submit" | "reset";
  }
>(
  (
    { onClick, disabled, title, children, className = "", type = "button" },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={`icon-button ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  ),
);
