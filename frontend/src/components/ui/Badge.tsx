"use client";
import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "info" | "success" | "warning" | "error" | "default";
  customColor?: string;
  customBgColor?: string;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", customColor, customBgColor, style, children, ...props }, ref) => {
    let variantClass = "badge";
    if (variant === "info") variantClass = "badge badge-info";
    if (variant === "success") variantClass = "badge badge-success";
    if (variant === "warning") variantClass = "badge badge-warning";
    if (variant === "error") variantClass = "badge badge-error"; // Assume we might have this

    const customStyle: React.CSSProperties = { ...style };
    if (customColor) customStyle.color = customColor;
    if (customBgColor) customStyle.background = customBgColor;

    return (
      <span ref={ref} className={`${variantClass} ${className}`.trim()} style={customStyle} {...props}>
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";
