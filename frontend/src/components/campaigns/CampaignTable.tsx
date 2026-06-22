"use client";
import React from "react";
import { Rocket, Trash, Zap, Tag } from "lucide-react";
import { EmptyState, LoadingSkeleton, Badge, Button } from "@/components/ui";
import { Megaphone } from "lucide-react";

const statusStyles: Record<string, string> = {
  Draft: "badge-info",
  Scheduled: "badge-warning",
  Running: "badge-success",
  Completed: "badge-success",
};

interface CampaignTableProps {
  campaigns: any[];
  loading: boolean;
  onLaunch: (campaign: any) => void;
  onDelete: (id: number) => void;
}

export function CampaignTable({ campaigns, loading, onLaunch, onDelete }: CampaignTableProps) {
  if (loading) return <LoadingSkeleton />;

  if (campaigns.length === 0) {
    return <EmptyState icon={<Megaphone size={40} />} message="No campaigns created yet." />;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Campaign</th>
          <th>Type</th>
          <th>Offer</th>
          <th>Scheduled</th>
          <th>Status</th>
          <th style={{ width: 120 }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {campaigns.map((c) => (
          <tr key={c.id}>
            <td style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{c.name}</td>
            <td>
              <Badge variant="info"><Zap size={11} /> {c.type}</Badge>
            </td>
            <td>
              {c.offer ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Tag size={12} /> {c.offer.title}
                </span>
              ) : "—"}
            </td>
            <td style={{ fontSize: "0.8rem" }}>{new Date(c.scheduled_at).toLocaleString()}</td>
            <td>
              <Badge variant={statusStyles[c.status] as any || "info"}>{c.status}</Badge>
            </td>
            <td>
              <div style={{ display: "flex", gap: 6 }}>
                {c.status === "Draft" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onLaunch(c)}
                  >
                    <Rocket size={12} /> Launch
                  </Button>
                )}
                {(c.status === "Draft" || c.status === "Completed") && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(c.id)}
                  >
                    <Trash size={12} /> Delete
                  </Button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
