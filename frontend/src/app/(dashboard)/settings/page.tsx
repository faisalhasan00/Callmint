"use client";

import React, { useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import { Settings, Save, Clock, Building, ShieldAlert, CheckCircle2, AlertCircle, Phone, Info } from "lucide-react";

export default function SettingsPage() {
  const [business, setBusiness] = useState({
    name: "",
    type: "Salon",
    timings_open: "09:00",
    timings_close: "20:00",
  });
  
  // Follow-up configurations stored in LocalStorage for mockup demonstration
  const [followUpConfig, setFollowUpConfig] = useState({
    smsConfirmation: true,
    outboundFeedback: false,
    rescheduleAlerts: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadBusinessData();
    const local = localStorage.getItem("voiceai_followup_rules");
    if (local) {
      try {
        setFollowUpConfig(JSON.parse(local));
      } catch {}
    }
  }, []);

  async function loadBusinessData() {
    try {
      const data = await authApi.getBusiness();
      setBusiness({
        name: data.name || "",
        type: data.type || "Salon",
        timings_open: data.timings_open || "09:00",
        timings_close: data.timings_close || "20:00",
      });
    } catch (err: any) {
      setErrorMsg("Failed to load business profile details.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      // 1. Save business details to backend database
      await authApi.updateBusiness(business);
      
      // 2. Save follow-up configs locally
      localStorage.setItem("voiceai_followup_rules", JSON.stringify(followUpConfig));
      
      setSuccessMsg("Settings updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div className="shimmer" style={{ width: 300, height: 40, borderRadius: 10 }} />
        <div className="shimmer" style={{ width: "100%", height: 350, borderRadius: 16 }} />
      </div>
    );
  }

  // Hours list for timings selection (07:00 to 23:00)
  const hours = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 7;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Title */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Settings</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>
          Adjust your business profile details, working hours, and outbound customer follow-up rules.
        </p>
      </div>

      {successMsg && (
        <div
          className="badge-success animate-fade-in"
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={16} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div
          className="badge-error animate-fade-in"
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
        
        {/* Profile and Hours Card */}
        <div className="glass-card animate-fade-in" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--color-border)", paddingBottom: 16 }}>
            <Building size={20} color="var(--color-accent-primary-light)" />
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Business Profile & Timings</h2>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>
              Business Name
            </label>
            <input
              className="input-field"
              placeholder="e.g. Shadnagar Luxury Salon"
              value={business.name}
              onChange={(e) => setBusiness({ ...business, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>
              Business Model Type
            </label>
            <select
              className="input-field"
              value={business.type}
              onChange={(e) => setBusiness({ ...business, type: e.target.value })}
            >
              <option>Salon</option>
              <option>SuperMart</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>
                Opening Hours
              </label>
              <select
                className="input-field"
                value={business.timings_open}
                onChange={(e) => setBusiness({ ...business, timings_open: e.target.value })}
              >
                {hours.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>
                Closing Hours
              </label>
              <select
                className="input-field"
                value={business.timings_close}
                onChange={(e) => setBusiness({ ...business, timings_close: e.target.value })}
              >
                {hours.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", height: 44, marginTop: 12 }} disabled={saving}>
            <Save size={18} /> {saving ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>

        {/* Integration and Rules Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Follow-up rules config */}
          <div className="glass-card animate-fade-in animate-delay-1" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--color-border)", paddingBottom: 16, marginBottom: 20 }}>
              <Clock size={20} color="var(--color-warning)" />
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Follow-up Call & SMS Rules</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>Send Booking Confirmation SMS</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginTop: 2 }}>
                    Trigger automated SMS via Twilio when the AI books an appointment.
                  </div>
                </div>
                <input
                  type="checkbox"
                  style={{ width: 44, height: 22, cursor: "pointer", accentColor: "var(--color-accent-primary)" }}
                  checked={followUpConfig.smsConfirmation}
                  onChange={(e) => setFollowUpConfig({ ...followUpConfig, smsConfirmation: e.target.checked })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>Outbound Feedback Campaign</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginTop: 2 }}>
                    AI automatically dials customers 24h post-appointment to ask for feedback.
                  </div>
                </div>
                <input
                  type="checkbox"
                  style={{ width: 44, height: 22, cursor: "pointer", accentColor: "var(--color-accent-primary)" }}
                  checked={followUpConfig.outboundFeedback}
                  onChange={(e) => setFollowUpConfig({ ...followUpConfig, outboundFeedback: e.target.checked })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>Rescheduling & Cancellation Alerts</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginTop: 2 }}>
                    Notify shop manager immediately when clients cancel or shift timings.
                  </div>
                </div>
                <input
                  type="checkbox"
                  style={{ width: 44, height: 22, cursor: "pointer", accentColor: "var(--color-accent-primary)" }}
                  checked={followUpConfig.rescheduleAlerts}
                  onChange={(e) => setFollowUpConfig({ ...followUpConfig, rescheduleAlerts: e.target.checked })}
                />
              </div>
            </div>
          </div>

          {/* Webhook & Telephony Information */}
          <div className="glass-card animate-fade-in animate-delay-2" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--color-border)", paddingBottom: 16, marginBottom: 20 }}>
              <Phone size={20} color="var(--color-accent-primary-light)" />
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Twilio Webhook Integration</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>
                  Inbound Webhook HTTP Route
                </span>
                <div
                  style={{
                    padding: "10px 12px",
                    background: "var(--color-bg-secondary)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: "0.8rem",
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                  }}
                >
                  http://&lt;your-domain&gt;/api/v1/twilio/inbound
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  padding: 12,
                  borderRadius: 8,
                  background: "rgba(99, 102, 241, 0.08)",
                  border: "1px solid rgba(99, 102, 241, 0.15)",
                  color: "var(--color-text-secondary)",
                  fontSize: "0.75rem",
                  lineHeight: 1.4,
                }}
              >
                <Info size={16} color="var(--color-accent-primary-light)" style={{ flexShrink: 0, marginTop: 1 }} />
                <span>
                  Provide this URL to your Twilio active phone number's <strong>"A call comes in"</strong> webhook section. Ensure the handler is configured as <strong>HTTP POST</strong>.
                </span>
              </div>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
}
