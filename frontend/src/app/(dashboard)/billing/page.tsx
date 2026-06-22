"use client";

import React, { useEffect, useState } from "react";
import { billingApi } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { CreditCard, Check, ShieldCheck, Activity, Calendar, Clock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BillingPage() {
  const router = useRouter();
  const { loadSubscription, loadUser } = useAppStore();
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    loadSubData();
  }, []);

  async function loadSubData() {
    try {
      const data = await billingApi.getStatus();
      setSub(data);
    } catch (err: any) {
      setErrorMsg("Failed to load subscription status.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubscribe(plan: string) {
    setSubmitting(plan);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const updatedSub = await billingApi.subscribe(plan);
      setSub(updatedSub);
      setSuccessMsg(`Successfully subscribed to the ${plan} Plan!`);
      // Update app store so the rest of the application gets activated immediately
      await loadSubscription();
      await loadUser();
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update subscription. Please try again.");
    } finally {
      setSubmitting(null);
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

  const usagePercent = sub ? Math.min(100, Math.round((sub.minutes_used / (sub.monthly_minutes_limit || 1)) * 100)) : 0;
  const isPending = !sub || sub.plan === "None" || sub.status !== "Active";

  return (
    <div style={{ maxWidth: 1000 }}>
      {/* Title */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Subscription & Billing</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>
          Manage your subscription plan, monitor voice agent minute usage, and choose your SaaS tier.
        </p>
      </div>

      {successMsg && (
        <div
          className="badge-success animate-fade-in"
          style={{
            padding: "14px 18px",
            borderRadius: 10,
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          <ShieldCheck size={18} />
          {successMsg} Redirecting to your dashboard...
        </div>
      )}

      {errorMsg && (
        <div
          className="badge-error animate-fade-in"
          style={{
            padding: "14px 18px",
            borderRadius: 10,
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          <AlertCircle size={18} />
          {errorMsg}
        </div>
      )}

      {/* Usage Meter Card */}
      <div className="glass-card animate-fade-in" style={{ padding: 28, marginBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <CreditCard size={20} color="var(--color-accent-primary-light)" />
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Current Subscription Status</h2>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginTop: 4 }}>
              Active package details and call minutes usage.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <span
              className="badge"
              style={{
                background: sub?.status === "Active" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                color: sub?.status === "Active" ? "#22c55e" : "#ef4444",
                padding: "6px 14px",
                fontSize: "0.8rem",
              }}
            >
              Status: {sub?.status || "Inactive"}
            </span>

            <span
              className="badge"
              style={{
                background: sub?.plan && sub.plan !== "None" ? "rgba(99, 102, 241, 0.15)" : "rgba(100, 116, 139, 0.15)",
                color: sub?.plan && sub.plan !== "None" ? "#818cf8" : "#94a3b8",
                padding: "6px 14px",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              Plan: {sub?.plan || "None"}
            </span>
          </div>
        </div>

        {sub && sub.plan !== "None" && (
          <div style={{ marginTop: 28, borderTop: "1px solid var(--color-border)", paddingTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: 8, fontWeight: 500 }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Call Minutes Consumption</span>
              <span>
                <strong>{sub.minutes_used.toFixed(1)}</strong> / {sub.monthly_minutes_limit} mins ({usagePercent}%)
              </span>
            </div>

            <div className="progress-bar" style={{ height: 12, marginBottom: 20 }}>
              <div className="progress-bar-fill" style={{ width: `${usagePercent}%` }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginTop: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Calendar size={15} style={{ color: "var(--color-text-muted)" }} />
                <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                  Cycle Starts: {new Date(sub.billing_cycle_start).toLocaleDateString()}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Clock size={15} style={{ color: "var(--color-text-muted)" }} />
                <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                  Renews: {new Date(sub.billing_cycle_end).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {isPending && (
          <div
            style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 10,
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid rgba(245, 158, 11, 0.2)",
              color: "var(--color-warning)",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Activity size={18} className="pulse-glow" />
            Your account is locked. Choose a subscription package below to activate your AI Voice Employee dashboard.
          </div>
        )}
      </div>

      {/* Plan Cards Grid */}
      <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 20 }}>Select Your Plan</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
        
        {/* Starter Plan */}
        <div
          className="glass-card animate-fade-in"
          style={{
            padding: 32,
            position: "relative",
            border: sub?.plan === "Starter" ? "2px solid var(--color-accent-primary)" : undefined,
          }}
        >
          {sub?.plan === "Starter" && (
            <div
              style={{
                position: "absolute",
                top: -12,
                right: 20,
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 999,
              }}
            >
              ACTIVE PLAN
            </div>
          )}

          <div style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 6 }}>Starter Plan</div>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem", marginBottom: 20 }}>
            Ideal for local single-practitioner salons and smaller stores.
          </p>

          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
            <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-text-primary)" }}>₹999</span>
            <span style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem" }}>/ month</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 30 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.85rem" }}>
              <Check size={16} color="var(--color-success)" />
              <span><strong>200 minutes</strong> of call processing</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.85rem" }}>
              <Check size={16} color="var(--color-success)" />
              <span>Automated appointment booking & CRM</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.85rem" }}>
              <Check size={16} color="var(--color-success)" />
              <span>Telugu, Hindi, and Hinglish agent conversations</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.85rem" }}>
              <Check size={16} color="var(--color-success)" />
              <span>Outbound promotional campaigns launcher</span>
            </div>
          </div>

          <button
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", height: 44 }}
            disabled={submitting !== null || sub?.plan === "Starter"}
            onClick={() => handleSubscribe("Starter")}
          >
            {submitting === "Starter" ? "Processing..." : sub?.plan === "Starter" ? "Current Active Plan" : "Activate Starter Plan"}
          </button>
        </div>

        {/* Growth Plan */}
        <div
          className="glass-card animate-fade-in animate-delay-1"
          style={{
            padding: 32,
            position: "relative",
            border: sub?.plan === "Growth" ? "2px solid var(--color-accent-primary)" : undefined,
          }}
        >
          {sub?.plan === "Growth" && (
            <div
              style={{
                position: "absolute",
                top: -12,
                right: 20,
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 999,
              }}
            >
              ACTIVE PLAN
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 6 }}>Growth Plan</div>
            <span
              className="badge"
              style={{
                background: "rgba(168, 85, 247, 0.15)",
                color: "#a855f7",
                fontSize: "0.7rem",
                marginBottom: 4,
              }}
            >
              Recommended
            </span>
          </div>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem", marginBottom: 20 }}>
            Best for growing salons or retail supermarts with higher call volumes.
          </p>

          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
            <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-text-primary)" }}>₹1,999</span>
            <span style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem" }}>/ month</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 30 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.85rem" }}>
              <Check size={16} color="var(--color-success)" />
              <span><strong>500 minutes</strong> of call processing</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.85rem" }}>
              <Check size={16} color="var(--color-success)" />
              <span>Everything in Starter included</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.85rem" }}>
              <Check size={16} color="var(--color-success)" />
              <span>Faster AI agent reaction time priority</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.85rem" }}>
              <Check size={16} color="var(--color-success)" />
              <span>Custom follow-up call automation rules</span>
            </div>
          </div>

          <button
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", height: 44, background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
            disabled={submitting !== null || sub?.plan === "Growth"}
            onClick={() => handleSubscribe("Growth")}
          >
            {submitting === "Growth" ? "Processing..." : sub?.plan === "Growth" ? "Current Active Plan" : "Activate Growth Plan"}
          </button>
        </div>

      </div>
    </div>
  );
}
