"use client";

import React, { useEffect, useState } from "react";
import { callsApi } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import {
  Phone,
  Users,
  Calendar,
  Tag,
  TrendingUp,
  Clock,
  Mic,
  ArrowUpRight,
} from "lucide-react";

interface Stats {
  total_calls: number;
  total_customers: number;
  appointments_today: number;
  active_offers: number;
  minutes_used: number;
  minutes_limit: number;
  plan_name: string;
  subscription_status: string;
}

export default function DashboardPage() {
  const { subscription } = useAppStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    callsApi
      .stats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        {
          label: "Total Calls",
          value: stats.total_calls,
          icon: Phone,
          colorClass: "text-blue-600 dark:text-blue-400",
          bgClass: "bg-blue-50 dark:bg-blue-900/20",
          delay: "animate-delay-1",
        },
        {
          label: "Customers",
          value: stats.total_customers,
          icon: Users,
          colorClass: "text-indigo-600 dark:text-indigo-400",
          bgClass: "bg-indigo-50 dark:bg-indigo-900/20",
          delay: "animate-delay-2",
        },
        {
          label: "Today's Appointments",
          value: stats.appointments_today,
          icon: Calendar,
          colorClass: "text-emerald-600 dark:text-emerald-400",
          bgClass: "bg-emerald-50 dark:bg-emerald-900/20",
          delay: "animate-delay-3",
        },
        {
          label: "Active Offers",
          value: stats.active_offers,
          icon: Tag,
          colorClass: "text-amber-600 dark:text-amber-400",
          bgClass: "bg-amber-50 dark:bg-amber-900/20",
          delay: "animate-delay-4",
        },
      ]
    : [];

  const usagePercent = stats
    ? Math.min((stats.minutes_used / Math.max(stats.minutes_limit, 1)) * 100, 100)
    : 0;

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          Dashboard
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>
          Welcome back. Here&apos;s your business overview.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="shimmer" style={{ height: 120, borderRadius: 12 }} />
          ))}
        </div>
      ) : (
        <>
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
            {statCards.map((card) => (
              <div
                key={card.label}
                className={`glass-card stat-card animate-fade-in ${card.delay}`}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div
                    className={card.bgClass}
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <card.icon size={20} className={card.colorClass} />
                  </div>
                  <ArrowUpRight size={16} color="var(--color-text-muted)" />
                </div>
                <div className={`stat-value ${card.colorClass}`} style={{ marginTop: 12 }}>
                  {card.value}
                </div>
                <div className="stat-label">{card.label}</div>
              </div>
            ))}
          </div>

          {/* Usage & Plan Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Usage meter */}
            <div className="glass-card animate-fade-in animate-delay-2 lg:col-span-2" style={{ padding: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <div>
                  <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Minutes Usage</h2>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: 2 }}>
                    Current billing cycle
                  </p>
                </div>
                <span
                  className={
                    stats?.subscription_status === "Active" ? "badge badge-success" : "badge badge-warning"
                  }
                >
                  {stats?.subscription_status || "Pending"}
                </span>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.8rem",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "var(--color-text-secondary)" }}>
                    {stats?.minutes_used?.toFixed(1)} min used
                  </span>
                  <span style={{ color: "var(--color-text-muted)" }}>
                    {stats?.minutes_limit} min limit
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${usagePercent}%`,
                      background:
                        usagePercent > 80
                          ? "var(--color-error)"
                          : "var(--color-accent-primary)",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 32,
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                <div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800 }} className="gradient-text">
                    {stats?.plan_name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                    Current Plan
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-success)" }}>
                    {Math.max((stats?.minutes_limit || 0) - (stats?.minutes_used || 0), 0).toFixed(0)}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                    Minutes Remaining
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card animate-fade-in animate-delay-3" style={{ padding: 28 }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 20 }}>Quick Actions</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="/appointments" className="btn-secondary" style={{ textDecoration: "none" }}>
                  <Calendar size={16} /> New Appointment
                </a>
                <a href="/campaigns" className="btn-secondary" style={{ textDecoration: "none" }}>
                  <Mic size={16} /> Launch Campaign
                </a>
                <a href="/customers" className="btn-secondary" style={{ textDecoration: "none" }}>
                  <Users size={16} /> Add Customer
                </a>
                <a href="/ai-config" className="btn-primary" style={{ textDecoration: "none", justifyContent: "center" }}>
                  <TrendingUp size={16} /> Configure AI Voice
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
