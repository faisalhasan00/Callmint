"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { User } from "lucide-react";

export default function RoundTheClock() {
  return (
    <section style={{ padding: "80px 5%", background: "transparent" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "60px" }}>
        
        {/* Left Text */}
        <div style={{ flex: "1 1 450px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 800, color: "#4c1d95", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            Round the clock,<br/>availability
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#475569", lineHeight: 1.6 }}>
            Callmint - AI Customer Service Agent - handles outbound and inbound calls 24/7, seamlessly scaling during peak hours to meet demand.
          </p>

          {/* Testimonial Box */}
          <div style={{ background: "#6b21a8", borderRadius: "16px", padding: "32px", color: "white", marginTop: "16px", position: "relative", overflow: "hidden" }}>
            {/* Subtle background waves */}
            <div style={{ position: "absolute", bottom: -20, right: -20, width: 100, height: 100, borderRadius: "50%", border: "4px solid rgba(255,255,255,0.1)", opacity: 0.5 }} />
            <div style={{ position: "absolute", bottom: -40, right: -40, width: 150, height: 150, borderRadius: "50%", border: "4px solid rgba(255,255,255,0.1)", opacity: 0.3 }} />
            
            <p style={{ fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "24px", position: "relative", zIndex: 1 }}>
              We no longer worry about call surges—Callmint adapts instantly, keeping our response times fast and our customers happy. The scalability and reliability have helped us improve CSAT by 40%.
            </p>
            
            <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative", zIndex: 1 }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={20} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Deepak Srinivasan ✨</div>
                <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>Operations Manager</div>
              </div>
            </div>
          </div>

          <Button variant="primary" style={{ background: "#ef4444", color: "white", padding: "16px 36px", fontSize: "1rem", borderRadius: "8px", border: "1px solid #b91c1c", width: "fit-content", marginTop: "16px" }} onClick={() => window.open("https://wa.me/918332063638", "_blank")}>
            Get Started Now
          </Button>
        </div>

        {/* Right Animation */}
        <div style={{ flex: "1 1 500px", minHeight: "500px", position: "relative" }}>
          <iframe 
            src="https://rive.app/s/U5mmi5ua0EGLpwzbCnA9CQ/embed" 
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            allowFullScreen
          />
        </div>

      </div>
    </section>
  );
}
