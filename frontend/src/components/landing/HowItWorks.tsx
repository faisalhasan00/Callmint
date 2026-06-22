"use client";

import React from "react";

export default function HowItWorks() {
  return (
    <section style={{ padding: "100px 20px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "64px", letterSpacing: "-0.02em" }}>How Callmint Works</h2>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "40px" }}>
          {[
            { step: "1", title: "Connect", desc: "Sign up and configure your AI voice settings." },
            { step: "2", title: "Automate", desc: "Import customers and let the AI handle inbound/outbound calls." },
            { step: "3", title: "Grow", desc: "Watch your appointments fill up and revenue increase." }
          ].map((item, idx) => (
            <div key={idx} style={{ flex: "1 1 250px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--color-primary)", color: "white", fontSize: "1.5rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>{item.title}</h3>
              <p style={{ color: "var(--color-text-secondary)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
