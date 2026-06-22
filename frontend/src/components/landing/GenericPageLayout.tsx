"use client";

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PageSection {
  heading: string;
  items: any[];
}

interface GenericPageLayoutProps {
  title: string;
  subtitle: string;
  overview?: string;
  whyItMatters?: PageSection;
  howItHelps?: PageSection;
  callToAction?: string;
  children?: React.ReactNode;
}

export default function GenericPageLayout({ 
  title, 
  subtitle, 
  overview,
  whyItMatters,
  howItHelps,
  callToAction,
  children 
}: GenericPageLayoutProps) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "var(--font-geist-sans)" }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: "80px" }}>
        {/* Header Section */}
        <section style={{ 
          background: "linear-gradient(135deg, #f8fafc 0%, #ede9fe 100%)",
          padding: "80px 24px",
          textAlign: "center"
        }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "3.5rem", fontWeight: 800, color: "#0f172a", marginBottom: "24px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              {title}
            </h1>
            <p style={{ fontSize: "1.25rem", color: "#475569", lineHeight: 1.6 }}>
              {subtitle}
            </p>
          </div>
        </section>

        {/* Rich Content Section */}
        <section style={{ padding: "64px 24px", maxWidth: "900px", margin: "0 auto" }}>
          
          {/* Overview */}
          {overview && (
            <div style={{ marginBottom: "64px" }}>
              <p style={{ fontSize: "1.2rem", color: "#334155", lineHeight: 1.8, borderLeft: "4px solid #8b5cf6", paddingLeft: "24px" }}>
                {overview}
              </p>
            </div>
          )}

          {/* Why It Matters */}
          {whyItMatters && (
            <div style={{ marginBottom: "64px" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#0f172a", marginBottom: "32px" }}>
                {whyItMatters.heading}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {whyItMatters.items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "12px", background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <div style={{ marginTop: "2px" }}>
                      <CheckCircle2 size={24} color="#8b5cf6" />
                    </div>
                    <p style={{ fontSize: "1.1rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How It Helps */}
          {howItHelps && (
            <div style={{ marginBottom: "64px" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#0f172a", marginBottom: "32px" }}>
                {howItHelps.heading}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                {howItHelps.items.map((item: any, idx: number) => (
                  <div key={idx} style={{ background: "#ffffff", padding: "32px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>
                      {item.title}
                    </h3>
                    <p style={{ color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback for old content array */}
          {children && (
            <div style={{ marginBottom: "64px" }}>
              {children}
            </div>
          )}

          {/* Call to Action */}
          {callToAction && (
            <div style={{ background: "#4c1d95", padding: "48px", borderRadius: "24px", textAlign: "center", color: "white", marginTop: "40px" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "24px" }}>
                {callToAction}
              </h2>
              <Button size="lg" style={{ background: "white", color: "#4c1d95", fontSize: "1.1rem", padding: "0 32px" }}>
                Get Started Now <ArrowRight size={20} style={{ marginLeft: "8px" }} />
              </Button>
            </div>
          )}

        </section>
      </main>

      <Footer />
    </div>
  );
}
