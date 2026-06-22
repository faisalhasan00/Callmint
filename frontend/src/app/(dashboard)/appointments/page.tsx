"use client";

import React, { useEffect, useState } from "react";
import { appointmentsApi, customersApi } from "@/lib/api";
import { Calendar, Plus, Clock, User, XCircle } from "lucide-react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [service, setService] = useState("");

  useEffect(() => {
    Promise.all([appointmentsApi.list(), customersApi.list()])
      .then(([appts, custs]) => {
        setAppointments(appts);
        setCustomers(custs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await appointmentsApi.create({
        customer_id: parseInt(customerId),
        date_time: new Date(dateTime).toISOString(),
        service,
      });
      setShowForm(false);
      setCustomerId("");
      setDateTime("");
      setService("");
      const appts = await appointmentsApi.list();
      setAppointments(appts);
    } catch {}
  }

  async function handleCancel(id: number) {
    if (!confirm("Cancel this appointment?")) return;
    try {
      await appointmentsApi.cancel(id);
      const appts = await appointmentsApi.list();
      setAppointments(appts);
    } catch {}
  }

  const statusStyles: Record<string, string> = {
    Scheduled: "badge-success",
    Rescheduled: "badge-warning",
    Cancelled: "badge-error",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Appointments</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>
            Manage your booking calendar
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> New Appointment
        </button>
      </div>

      {showForm && (
        <div className="glass-card animate-fade-in" style={{ padding: 24, marginBottom: 24 }}>
          <form onSubmit={handleCreate} style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>Customer</label>
              <select className="input-field" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>Date & Time</label>
              <input type="datetime-local" className="input-field" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required />
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>Service</label>
              <input className="input-field" placeholder="e.g. Haircut" value={service} onChange={(e) => setService(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary" style={{ height: 42 }}>Book</button>
          </form>
        </div>
      )}

      <div className="glass-card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40 }}>
            <div className="shimmer" style={{ width: "100%", height: 200, borderRadius: 12 }} />
          </div>
        ) : appointments.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", color: "var(--color-text-muted)" }}>
            <Calendar size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p>No appointments yet.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th style={{ width: 80 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <User size={14} /> {a.customer?.name || `Customer #${a.customer_id}`}
                    </span>
                  </td>
                  <td>{a.service}</td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <Clock size={13} />
                      {new Date(a.date_time).toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${statusStyles[a.status] || "badge-info"}`}>{a.status}</span>
                  </td>
                  <td>
                    {a.status !== "Cancelled" && (
                      <button
                        onClick={() => handleCancel(a.id)}
                        style={{ background: "none", border: "none", color: "var(--color-error)", cursor: "pointer", padding: 4 }}
                        title="Cancel"
                      >
                        <XCircle size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
