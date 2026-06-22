"use client";
import React from "react";
import { Rocket } from "lucide-react";
import { Modal, Button } from "@/components/ui";

interface LaunchModalProps {
  campaign: any | null;
  targets: any[];
  loading: boolean;
  error: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

export function LaunchModal({ campaign, targets, loading, error, onConfirm, onClose }: LaunchModalProps) {
  return (
    <Modal isOpen={!!campaign} onClose={onClose}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 8 }}>Confirm Launch</h2>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginBottom: 16 }}>
        You are about to launch <strong>{campaign?.name}</strong>. Here is the exact list of customers the AI will call:
      </p>

      <div style={{
        flex: 1, overflowY: "auto",
        border: `1px solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
        borderRadius: 8, padding: 12, marginBottom: 16, minHeight: 120, maxHeight: 320
      }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "var(--color-text-muted)", padding: 20 }}>Loading target audience...</div>
        ) : error ? (
          <div style={{ textAlign: "center", color: "var(--color-error)", padding: 20 }}>
            ⚠️ {error}
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", display: "block", marginTop: 8 }}>
              Make sure the backend is running, then try again.
            </span>
          </div>
        ) : targets.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--color-text-muted)", padding: 20 }}>
            No customers matched the criteria for this campaign.
          </div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {targets.map((c, idx) => (
              <li key={c.id} style={{
                padding: "8px 0",
                borderBottom: idx < targets.length - 1 ? "1px solid var(--color-border)" : "none",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{c.name}</span>
                <span style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem" }}>{c.phone}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!loading && !error && (
        <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 16 }}>
          Total Target:{" "}
          <span style={{ color: targets.length > 0 ? "var(--color-success)" : "var(--color-text-muted)" }}>
            {targets.length} customers
          </span>
        </div>
      )}

      <div style={{ display: "flex", gap: 12 }}>
        <Button
          variant="primary"
          style={{ flex: 1 }}
          onClick={onConfirm}
          disabled={loading || targets.length === 0}
        >
          <Rocket size={16} /> Confirm Launch
        </Button>
        <Button variant="secondary" style={{ flex: 1 }} onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
