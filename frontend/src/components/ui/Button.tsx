"use client";
import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      style,
      disabled,
      ...props
    },
    ref
  ) => {
    let className = "btn-primary"; // default class from globals.css
    
    // In our globals.css we have btn-primary and btn-secondary
    // We can map variants to inline styles or existing classes
    if (variant === "secondary") className = "btn-secondary";
    
    // We can enhance it with custom styles
    const baseStyle: any = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      width: fullWidth ? "100%" : undefined,
      opacity: disabled || loading ? 0.7 : 1,
      cursor: disabled || loading ? "not-allowed" : "pointer",
      ...style,
    };

    if (variant === "danger") {
      baseStyle.backgroundColor = "var(--color-error)";
      baseStyle.color = "white";
      baseStyle.border = "none";
    }

    if (variant === "ghost") {
      baseStyle.backgroundColor = "transparent";
      baseStyle.color = "var(--color-text-primary)";
      baseStyle.border = "none";
      className = "";
    }

    if (size === "sm") {
      baseStyle.padding = "6px 12px";
      baseStyle.fontSize = "0.75rem";
      baseStyle.height = "auto";
    }

    return (
      <motion.button
        ref={ref}
        className={className}
        style={baseStyle}
        disabled={disabled || loading}
        whileTap={!(disabled || loading) ? { scale: 0.95 } : undefined}
        whileHover={!(disabled || loading) ? { scale: 1.02 } : undefined}
        {...props}
      >
        {loading ? (
          <div style={{ display: "flex", gap: "4px" }}>
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor" }} />
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor" }} />
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor" }} />
          </div>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
