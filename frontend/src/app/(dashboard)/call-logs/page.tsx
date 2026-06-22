"use client";

import React, { useEffect, useState } from "react";
import { callsApi } from "@/lib/api";
import { Phone, PhoneIncoming, PhoneOutgoing, Clock, FileText } from "lucide-react";

export default function CallLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    callsApi.list()
      .then(setLogs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Call Logs</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>
          Review AI call history, recordings, and transcripts
        </p>
      </div>

      <div className="glass-card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40 }}>
            <div className="shimmer" style={{ width: "100%", height: 200, borderRadius: 12 }} />
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", color: "var(--color-text-muted)" }}>
            <Phone size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p>No calls recorded yet. Calls will appear here once the AI starts taking calls.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Direction</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Date</th>
                <th>Transcript</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <React.Fragment key={log.id}>
                  <tr>
                    <td>
                      {log.direction === "inbound" ? (
                        <span className="badge badge-info"><PhoneIncoming size={12} /> Inbound</span>
                      ) : (
                        <span className="badge badge-warning"><PhoneOutgoing size={12} /> Outbound</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>
                      {log.customer_id ? `Customer #${log.customer_id}` : "Unknown"}
                    </td>
                    <td>
                      <span className={`badge ${log.status === "completed" ? "badge-success" : log.status === "failed" ? "badge-error" : "badge-info"}`}>
                        {log.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <Clock size={13} />
                        {Math.floor(log.duration_seconds / 60)}m {log.duration_seconds % 60}s
                      </span>
                    </td>
                    <td style={{ fontSize: "0.8rem" }}>{new Date(log.created_at).toLocaleString()}</td>
                    <td>
                      {log.transcript && (
                        <button
                          onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--color-accent-primary-light)",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: "0.8rem",
                          }}
                        >
                          <FileText size={14} /> {expandedId === log.id ? "Hide" : "View"}
                        </button>
                      )}
                    </td>
                  </tr>
                  {expandedId === log.id && log.transcript && (
                    <tr>
                      <td colSpan={6} style={{ padding: 0 }}>
                        <div
                          style={{
                            background: "var(--color-bg-secondary)",
                            padding: "16px 20px",
                            fontFamily: "monospace",
                            fontSize: "0.8rem",
                            lineHeight: 1.6,
                            whiteSpace: "pre-wrap",
                            color: "var(--color-text-secondary)",
                            maxHeight: 300,
                            overflowY: "auto",
                          }}
                        >
                          {log.transcript}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
