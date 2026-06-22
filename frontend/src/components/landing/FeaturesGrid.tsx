"use client";

import React from "react";
import { 
  PhoneCall,
  CalendarCheck,
  TrendingUp,
  Database,
  Languages,
  MessageSquare,
  ArrowRight
} from "lucide-react";

export default function FeaturesGrid() {
  return (
    <section style={{ padding: "0 5% 100px", position: "relative", zIndex: 1, background: "transparent" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        
        {/* Card 1 */}
        <div style={{ background: "white", border: "1px solid #e9d5ff", borderRadius: "16px", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", cursor: "pointer", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform="translateY(-4px)"} onMouseOut={e => e.currentTarget.style.transform="none"}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <PhoneCall size={28} color="#8b5cf6" />
            <div style={{ fontWeight: 600, color: "#4c1d95", fontSize: "1.05rem" }}>Round the clock,<br/>availability</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #4c1d95", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowRight size={16} color="#4c1d95" style={{ transform: "rotate(45deg)" }} />
          </div>
        </div>

        {/* Card 2 */}
        <div style={{ background: "white", border: "1px solid #e9d5ff", borderRadius: "16px", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", cursor: "pointer", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform="translateY(-4px)"} onMouseOut={e => e.currentTarget.style.transform="none"}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <MessageSquare size={28} color="#8b5cf6" />
            <div style={{ fontWeight: 600, color: "#4c1d95", fontSize: "1.05rem" }}>Better Engagement<br/>with Voice AI</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #4c1d95", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowRight size={16} color="#4c1d95" style={{ transform: "rotate(45deg)" }} />
          </div>
        </div>

        {/* Card 3 */}
        <div style={{ background: "white", border: "1px solid #e9d5ff", borderRadius: "16px", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", cursor: "pointer", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform="translateY(-4px)"} onMouseOut={e => e.currentTarget.style.transform="none"}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <CalendarCheck size={28} color="#8b5cf6" />
            <div style={{ fontWeight: 600, color: "#4c1d95", fontSize: "1.05rem" }}>Industry-specific<br/>ready-to-use flows</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #4c1d95", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowRight size={16} color="#4c1d95" style={{ transform: "rotate(45deg)" }} />
          </div>
        </div>

        {/* Card 4 */}
        <div style={{ background: "white", border: "1px solid #e9d5ff", borderRadius: "16px", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", cursor: "pointer", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform="translateY(-4px)"} onMouseOut={e => e.currentTarget.style.transform="none"}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <TrendingUp size={28} color="#8b5cf6" />
            <div style={{ fontWeight: 600, color: "#4c1d95", fontSize: "1.05rem" }}>Get detailed<br/>analytics</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #4c1d95", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowRight size={16} color="#4c1d95" style={{ transform: "rotate(45deg)" }} />
          </div>
        </div>

        {/* Card 5 */}
        <div style={{ background: "white", border: "1px solid #e9d5ff", borderRadius: "16px", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", cursor: "pointer", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform="translateY(-4px)"} onMouseOut={e => e.currentTarget.style.transform="none"}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Database size={28} color="#8b5cf6" />
            <div style={{ fontWeight: 600, color: "#4c1d95", fontSize: "1.05rem" }}>Easy integrations<br/>with business apps</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #4c1d95", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowRight size={16} color="#4c1d95" style={{ transform: "rotate(45deg)" }} />
          </div>
        </div>

        {/* Card 6 */}
        <div style={{ background: "white", border: "1px solid #e9d5ff", borderRadius: "16px", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", cursor: "pointer", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform="translateY(-4px)"} onMouseOut={e => e.currentTarget.style.transform="none"}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Languages size={28} color="#8b5cf6" />
            <div style={{ fontWeight: 600, color: "#4c1d95", fontSize: "1.05rem" }}>Multi-language<br/>support</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #4c1d95", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowRight size={16} color="#4c1d95" style={{ transform: "rotate(45deg)" }} />
          </div>
        </div>

      </div>
    </section>
  );
}
