"use client";
import React from "react";
import { Globe, Phone, Trash2, Users } from "lucide-react";
import { EmptyState, LoadingSkeleton, Badge, Button, Input } from "@/components/ui";

const langColors: Record<string, string> = {
  Hindi: "#f59e0b",
  Telugu: "#22c55e",
  Hinglish: "#6366f1",
};

interface CustomerTableProps {
  customers: any[];
  loading: boolean;
  monthsInput: Record<number, string>;
  onMonthsChange: (id: number, value: string) => void;
  onAddSubscription: (customer: any, months: string) => void;
  onDelete: (id: number) => void;
}

export function CustomerTable({
  customers, loading, monthsInput, onMonthsChange, onAddSubscription, onDelete,
}: CustomerTableProps) {
  if (loading) return <LoadingSkeleton />;

  if (customers.length === 0) {
    return <EmptyState icon={<Users size={40} />} message="No customers found. Add your first customer above!" />;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Language</th>
          <th>Sub Status</th>
          <th>Added</th>
          <th style={{ width: 80 }}>Delete</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c) => {
          const isActive = c.subscription_end_date && new Date(c.subscription_end_date) > new Date();
          return (
            <tr key={c.id}>
              <td style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{c.name}</td>
              <td>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Phone size={13} /> {c.phone}
                </span>
              </td>
              <td>
                <Badge customBgColor={`${langColors[c.preferred_language] || "#6366f1"}20`} customColor={langColors[c.preferred_language] || "#6366f1"}>
                  <Globe size={11} /> {c.preferred_language}
                </Badge>
              </td>
              <td>
                <div style={{ fontSize: "0.8rem", fontWeight: isActive ? 600 : 400, color: isActive ? "var(--color-success)" : "var(--color-text-muted)", marginBottom: 4 }}>
                  {isActive ? `Active to ${new Date(c.subscription_end_date).toLocaleDateString()}` : "Free / Expired"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Input
                    type="number"
                    placeholder="Mths"
                    min="1"
                    value={monthsInput[c.id] || ""}
                    onChange={(e) => onMonthsChange(c.id, e.target.value)}
                    style={{ width: 60, padding: "4px 6px", fontSize: "0.8rem", height: "auto" }}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onAddSubscription(c, monthsInput[c.id] || "")}
                  >
                    Add
                  </Button>
                </div>
              </td>
              <td style={{ fontSize: "0.8rem" }}>{new Date(c.created_at).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(c.id)}
                  style={{ color: "var(--color-error)", padding: 4 }}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
