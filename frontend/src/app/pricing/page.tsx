"use client";

import React from "react";
import GenericPageLayout from "@/components/landing/GenericPageLayout";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

export default function PricingPage() {
  return (
    <GenericPageLayout 
      title="Simple, Transparent Pricing" 
      subtitle="Only pay for the minutes you use. No hidden fees."
    >
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "32px", marginTop: "20px" }}>
        
        {/* Starter Plan */}
        <div style={{ flex: "1 1 300px", maxWidth: "350px", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "40px", display: "flex", flexDirection: "column", background: "white", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>Starter</h3>
          <p style={{ color: "#64748b", marginBottom: "24px", minHeight: "48px" }}>Perfect for small local businesses getting started with Voice AI.</p>
          <div style={{ fontSize: "3rem", fontWeight: 800, color: "#2e1065", marginBottom: "8px" }}>₹2,999<span style={{ fontSize: "1.2rem", color: "#64748b", fontWeight: 500 }}>/mo</span></div>
          <p style={{ color: "#475569", marginBottom: "32px", fontWeight: 500 }}>Includes 1,000 AI Minutes</p>
          
          <Button variant="secondary" style={{ marginBottom: "32px", width: "100%", borderColor: "#4c1d95", color: "#4c1d95" }}>Get Started</Button>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {["1 AI Agent", "English & Hindi Support", "Basic Call Analytics", "Email Support", "Standard Voices"].map((feature, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", color: "#475569" }}>
                <CheckCircle2 size={18} color="#10b981" /> {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Pro Plan */}
        <div style={{ flex: "1 1 300px", maxWidth: "350px", border: "2px solid #8b5cf6", borderRadius: "16px", padding: "40px", display: "flex", flexDirection: "column", background: "white", boxShadow: "0 20px 40px rgba(139, 92, 246, 0.15)", position: "relative" }}>
          <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "#8b5cf6", color: "white", padding: "4px 16px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>Most Popular</div>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>Pro</h3>
          <p style={{ color: "#64748b", marginBottom: "24px", minHeight: "48px" }}>For growing businesses with high call volumes and outbound needs.</p>
          <div style={{ fontSize: "3rem", fontWeight: 800, color: "#2e1065", marginBottom: "8px" }}>₹7,999<span style={{ fontSize: "1.2rem", color: "#64748b", fontWeight: 500 }}>/mo</span></div>
          <p style={{ color: "#475569", marginBottom: "32px", fontWeight: 500 }}>Includes 5,000 AI Minutes</p>
          
          <Button variant="primary" style={{ marginBottom: "32px", width: "100%", background: "#8b5cf6" }}>Get Started</Button>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {["Up to 5 AI Agents", "All Regional Languages", "Outbound Campaigns", "CRM Integrations", "Priority Support", "Premium Voice Cloning"].map((feature, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", color: "#475569", fontWeight: i < 3 ? 600 : 400 }}>
                <CheckCircle2 size={18} color="#8b5cf6" /> {feature}
              </div>
            ))}
          </div>
        </div>

      </div>
    </GenericPageLayout>
  );
}
