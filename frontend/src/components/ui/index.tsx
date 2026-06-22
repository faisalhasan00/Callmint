"use client";
import React from "react";

export * from "./Button";
export * from "./Input";
export * from "./Select";
export * from "./Textarea";
export * from "./Badge";
export * from "./Card";
export * from "./PageHeader";
export * from "./SearchBar";

interface LoadingSkeletonProps {
  height?: number;
}

export function LoadingSkeleton({ height = 200 }: LoadingSkeletonProps) {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <div className="shimmer" style={{ width: "100%", height, borderRadius: 12 }} />
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  message: string;
}

export function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div style={{ padding: 60, textAlign: "center", color: "var(--color-text-muted)" }}>
      <div style={{ marginBottom: 12, opacity: 0.4 }}>{icon}</div>
      <p>{message}</p>
    </div>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: number;
}

export function Modal({ isOpen, onClose, children, maxWidth = 500 }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{ padding: 24, width: "100%", maxWidth, maxHeight: "85vh", display: "flex", flexDirection: "column" }}
      >
        {children}
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function FormField({ label, children, style }: FormFieldProps) {
  return (
    <div style={style}>
      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}
