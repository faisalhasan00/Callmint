"use client";
import React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  fullWidth?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", fullWidth = false, style, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`input-field ${className}`}
        style={{
          width: fullWidth ? "100%" : undefined,
          ...style,
        }}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";
