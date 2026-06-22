"use client";
import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", fullWidth = false, style, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`input-field ${className}`}
        style={{
          width: fullWidth ? "100%" : undefined,
          resize: "vertical",
          ...style,
        }}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
