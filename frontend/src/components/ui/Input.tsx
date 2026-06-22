"use client";
import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", fullWidth = false, style, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`input-field ${className}`}
        style={{
          width: fullWidth ? "100%" : undefined,
          ...style,
        }}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
