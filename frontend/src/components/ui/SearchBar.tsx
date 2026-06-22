import React from "react";
import { Search } from "lucide-react";
import { Input } from "./Input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search..." }: SearchBarProps) {
  return (
    <div style={{ position: "relative", marginBottom: 20, maxWidth: 400 }}>
      <Search size={16} style={{ position: "absolute", left: 14, top: 13, color: "var(--color-text-muted)" }} />
      <Input
        style={{ paddingLeft: 40 }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
