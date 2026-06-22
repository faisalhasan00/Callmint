"use client";

import React from "react";
import GenericPageLayout from "@/components/landing/GenericPageLayout";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <GenericPageLayout 
      title="About Callmint" 
      subtitle="We are on a mission to bring enterprise-grade Voice AI to every local business."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "60px" }}>
        
        <section>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#2e1065", marginBottom: "24px" }}>Our Story</h2>
          <p style={{ fontSize: "1.1rem", color: "#475569", lineHeight: 1.8, marginBottom: "16px" }}>
            Callmint started with a simple observation: local businesses lose a significant portion of their potential revenue simply because they can't answer the phone 24/7. Whether it's after hours, during peak rush times, or on holidays, missed calls mean missed opportunities.
          </p>
          <p style={{ fontSize: "1.1rem", color: "#475569", lineHeight: 1.8 }}>
            We built Callmint to solve this. Our AI doesn't just record messages—it has full, natural conversations. It books appointments, captures lead information, and even runs outbound promotional campaigns in native regional languages like Hindi and Telugu.
          </p>
        </section>

        <section style={{ background: "#faf5ff", padding: "40px", borderRadius: "16px", border: "1px solid #e9d5ff" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#2e1065", marginBottom: "24px" }}>Our Values</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "32px" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#4c1d95", marginBottom: "12px" }}>Accessibility</h3>
              <p style={{ color: "#475569", lineHeight: 1.6 }}>Enterprise-grade technology shouldn't just be for enterprises. We make Voice AI affordable and accessible for small businesses.</p>
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#4c1d95", marginBottom: "12px" }}>Regional Focus</h3>
              <p style={{ color: "#475569", lineHeight: 1.6 }}>We understand that in India, business happens in many languages. That's why Callmint natively supports Hindi, Telugu, and Hinglish.</p>
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#4c1d95", marginBottom: "12px" }}>Reliability</h3>
              <p style={{ color: "#475569", lineHeight: 1.6 }}>We act as the front door to your business. We take that responsibility seriously with robust, 99.9% uptime architecture.</p>
            </div>
          </div>
        </section>

        <section style={{ textAlign: "center", padding: "60px 0" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#2e1065", marginBottom: "24px" }}>Ready to transform your business?</h2>
          <Button variant="primary" style={{ padding: "16px 32px", fontSize: "1.1rem" }} onClick={() => window.open("https://wa.me/918332063638", "_blank")}>Contact Sales Team</Button>
        </section>

      </div>
    </GenericPageLayout>
  );
}
