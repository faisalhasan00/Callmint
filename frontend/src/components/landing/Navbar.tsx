"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  PhoneCall,
  CalendarCheck,
  Megaphone,
  Clock,
  CreditCard,
  Users,
  CheckCircle2,
  Database,
  Languages,
  Zap,
  Lock,
  ChevronDown,
  User
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [showPlatformMenu, setShowPlatformMenu] = useState(false);

  return (
    <nav style={{
      padding: "16px 5%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid var(--color-border)",
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(12px)",
      position: "sticky",
      top: 0,
      zIndex: 50
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <img src="/Logos/callmint-primary-logo.png" alt="Callmint" style={{ height: "32px", width: "auto", display: "block" }} />
      </Link>

      {/* Center Links (Hidden on small screens) */}
      <div className="hidden lg:flex" style={{ display: "flex", gap: "32px", alignItems: "center", color: "var(--color-text-secondary)", fontWeight: 500, fontSize: "0.95rem" }}>
        
        {/* Platform Mega Menu Wrapper */}
        <div 
          style={{ position: "relative", height: "100%", display: "flex", alignItems: "center" }}
          onMouseEnter={() => setShowPlatformMenu(true)}
          onMouseLeave={() => setShowPlatformMenu(false)}
        >
          <span style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 4, 
            cursor: "pointer", 
            transition: "color 0.2s",
            color: showPlatformMenu ? "var(--color-primary)" : "var(--color-text-secondary)",
            padding: "20px 0"
          }}>
            Platform <ChevronDown size={14} style={{ transform: showPlatformMenu ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </span>

          {/* Mega Menu Dropdown */}
          {showPlatformMenu && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: "absolute",
                top: "100%",
                left: "-250px", // offset to center it nicely
                width: "1000px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "24px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                padding: "40px",
                display: "grid",
                gridTemplateColumns: "1fr 1.2fr 1.5fr",
                gap: "40px",
                cursor: "default"
              }}
            >
              {/* Column 1 */}
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>Sales & Support</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <Link href="/platform/inbound" style={{ textDecoration: "none" }}>
                    <div style={{ cursor: "pointer" }} className="menu-item">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, color: "#0f172a", marginBottom: "4px" }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <PhoneCall size={12} color="#4c1d95" />
                        </div>
                        Inbound Call Handling
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", paddingLeft: "32px", lineHeight: 1.4 }}>Automatically answer customer queries 24/7 without delays.</div>
                    </div>
                  </Link>
                  <Link href="/platform/outbound" style={{ textDecoration: "none" }}>
                    <div style={{ cursor: "pointer" }} className="menu-item">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, color: "#0f172a", marginBottom: "4px" }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Megaphone size={12} color="#4c1d95" />
                        </div>
                        Outbound Campaigns
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", paddingLeft: "32px", lineHeight: 1.4 }}>Proactively reach out to leads for personalized sales and offers.</div>
                    </div>
                  </Link>
                  <Link href="/platform/appointment" style={{ textDecoration: "none" }}>
                    <div style={{ cursor: "pointer" }} className="menu-item">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, color: "#0f172a", marginBottom: "4px" }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <CalendarCheck size={12} color="#4c1d95" />
                        </div>
                        Appointment Booking
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", paddingLeft: "32px", lineHeight: 1.4 }}>Seamlessly book and confirm calendar events straight from calls.</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Column 2 */}
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>Top Solutions</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <Link href="/platform/after-hours" style={{ textDecoration: "none" }}>
                    <div style={{ cursor: "pointer" }} className="menu-item">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, color: "#0f172a", marginBottom: "4px" }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Clock size={12} color="#4c1d95" />
                        </div>
                        After-Hours Support
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", paddingLeft: "32px", lineHeight: 1.4 }}>Never miss a customer request outside of your store hours.</div>
                    </div>
                  </Link>
                  <Link href="/platform/order-confirmation" style={{ textDecoration: "none" }}>
                    <div style={{ cursor: "pointer" }} className="menu-item">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, color: "#0f172a", marginBottom: "4px" }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <CheckCircle2 size={12} color="#4c1d95" />
                        </div>
                        Order Confirmations
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", paddingLeft: "32px", lineHeight: 1.4 }}>Call customers to verify COD orders and reduce cancellations.</div>
                    </div>
                  </Link>
                  <Link href="/platform/payment" style={{ textDecoration: "none" }}>
                    <div style={{ cursor: "pointer" }} className="menu-item">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, color: "#0f172a", marginBottom: "4px" }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <CreditCard size={12} color="#4c1d95" />
                        </div>
                        Payment & Renewals
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", paddingLeft: "32px", lineHeight: 1.4 }}>Automate reminders for expiring subscriptions or pending payments.</div>
                    </div>
                  </Link>
                  <Link href="/platform/lead-qualification" style={{ textDecoration: "none" }}>
                    <div style={{ cursor: "pointer" }} className="menu-item">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, color: "#0f172a", marginBottom: "4px" }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Users size={12} color="#4c1d95" />
                        </div>
                        Lead Qualification
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", paddingLeft: "32px", lineHeight: 1.4 }}>Screen incoming leads instantly before handing off to human agents.</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Column 3 */}
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>Platform Overview</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  
                  <div style={{ background: "rgba(239, 68, 68, 0.05)", borderRadius: "16px", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "12px", background: "rgba(239, 68, 68, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Database size={20} color="#ef4444" />
                    </div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0f172a", lineHeight: 1.3 }}>Unified Voice & CRM Stack</div>
                  </div>

                  <div style={{ background: "rgba(139, 92, 246, 0.05)", borderRadius: "16px", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "12px", background: "rgba(139, 92, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Languages size={20} color="#8b5cf6" />
                    </div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0f172a", lineHeight: 1.3 }}>Built for Indian Regional Languages</div>
                  </div>

                  <div style={{ background: "rgba(59, 130, 246, 0.05)", borderRadius: "16px", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "12px", background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Zap size={20} color="#3b82f6" />
                    </div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0f172a", lineHeight: 1.3 }}>Fully Managed, Done-for-you</div>
                  </div>

                  <div style={{ background: "rgba(16, 185, 129, 0.05)", borderRadius: "16px", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "12px", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Lock size={20} color="#10b981" />
                    </div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0f172a", lineHeight: 1.3 }}>Enterprise-Ready Security</div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right side links */}
        <Link href="/pricing" style={{ cursor: "pointer", transition: "color 0.2s", textDecoration: "none", color: "inherit" }} onMouseOver={e => e.currentTarget.style.color="var(--color-text-primary)"} onMouseOut={e => e.currentTarget.style.color="var(--color-text-secondary)"}>
          Pricing
        </Link>
        <Link href="/resources/blogs" style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", transition: "color 0.2s", textDecoration: "none", color: "inherit" }} onMouseOver={e => e.currentTarget.style.color="var(--color-text-primary)"} onMouseOut={e => e.currentTarget.style.color="var(--color-text-secondary)"}>
          Insights <ChevronDown size={14} />
        </Link>
        <Link href="/about" style={{ cursor: "pointer", transition: "color 0.2s", textDecoration: "none", color: "inherit" }} onMouseOver={e => e.currentTarget.style.color="var(--color-text-primary)"} onMouseOut={e => e.currentTarget.style.color="var(--color-text-secondary)"}>
          About Us
        </Link>
      </div>

      {/* Right Actions */}
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <div className="hidden md:flex" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 500, color: "var(--color-text-secondary)", marginRight: "8px", fontSize: "0.95rem" }} onClick={() => window.open("https://wa.me/918332063638", "_blank")}>
          <User size={18} color="var(--color-primary)" /> Contact Sales
        </div>
        <Button variant="secondary" style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)", background: "transparent" }}>
          <PhoneCall size={16} /> Talk to Voice AI
        </Button>
        <Button variant="primary" onClick={() => window.open("https://wa.me/918332063638", "_blank")}>
          Book a Demo
        </Button>
      </div>
    </nav>
  );
}
