"use client";

import React from "react";
import { 
  CalendarCheck, 
  PhoneCall, 
  CreditCard, 
  Megaphone, 
  CheckCircle2, 
  MessageSquare 
} from "lucide-react";

export default function HandlesItAll() {
  return (
    <section style={{ padding: "100px 5%", background: "transparent", position: "relative" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        
        <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 800, color: "#2e1065", lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: "64px", maxWidth: "900px", margin: "0 auto 64px" }}>
          From Inbound Queries to Outbound Campaigns — Callmint Handles it All!
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          
          {/* Card 1 */}
          <div style={{ background: "#faf5ff", border: "2px solid #4c1d95", borderRadius: "16px", padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden", textAlign: "left" }}>
            <div style={{ fontWeight: 700, color: "#4c1d95", fontSize: "1.1rem" }}>Appointment<br/>Booking</div>
            <div style={{ position: "absolute", right: "-20px", top: "50%", transform: "translateY(-50%)", width: "80px", height: "80px", borderRadius: "50%", border: "1px solid #e9d5ff", background: "white", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: "10px" }}>
              <CalendarCheck size={28} color="#4c1d95" />
            </div>
          </div>

          {/* Card 2 */}
          <div style={{ background: "#faf5ff", border: "2px solid #4c1d95", borderRadius: "16px", padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden", textAlign: "left" }}>
            <div style={{ fontWeight: 700, color: "#4c1d95", fontSize: "1.1rem" }}>Inbound<br/>Inquiries</div>
            <div style={{ position: "absolute", right: "-20px", top: "50%", transform: "translateY(-50%)", width: "80px", height: "80px", borderRadius: "50%", border: "1px solid #e9d5ff", background: "white", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: "10px" }}>
              <PhoneCall size={28} color="#4c1d95" />
            </div>
          </div>

          {/* Card 3 */}
          <div style={{ background: "#faf5ff", border: "2px solid #4c1d95", borderRadius: "16px", padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden", textAlign: "left" }}>
            <div style={{ fontWeight: 700, color: "#4c1d95", fontSize: "1.1rem" }}>Subscription<br/>Renewals</div>
            <div style={{ position: "absolute", right: "-20px", top: "50%", transform: "translateY(-50%)", width: "80px", height: "80px", borderRadius: "50%", border: "1px solid #e9d5ff", background: "white", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: "10px" }}>
              <CreditCard size={28} color="#4c1d95" />
            </div>
          </div>

          {/* Card 4 */}
          <div style={{ background: "#faf5ff", border: "2px solid #4c1d95", borderRadius: "16px", padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden", textAlign: "left" }}>
            <div style={{ fontWeight: 700, color: "#4c1d95", fontSize: "1.1rem" }}>Promotional<br/>Campaigns</div>
            <div style={{ position: "absolute", right: "-20px", top: "50%", transform: "translateY(-50%)", width: "80px", height: "80px", borderRadius: "50%", border: "1px solid #e9d5ff", background: "white", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: "10px" }}>
              <Megaphone size={28} color="#4c1d95" />
            </div>
          </div>

          {/* Card 5 */}
          <div style={{ background: "#faf5ff", border: "2px solid #4c1d95", borderRadius: "16px", padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden", textAlign: "left" }}>
            <div style={{ fontWeight: 700, color: "#4c1d95", fontSize: "1.1rem" }}>Order<br/>Confirmations</div>
            <div style={{ position: "absolute", right: "-20px", top: "50%", transform: "translateY(-50%)", width: "80px", height: "80px", borderRadius: "50%", border: "1px solid #e9d5ff", background: "white", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: "10px" }}>
              <CheckCircle2 size={28} color="#4c1d95" />
            </div>
          </div>

          {/* Card 6 */}
          <div style={{ background: "#faf5ff", border: "2px solid #4c1d95", borderRadius: "16px", padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden", textAlign: "left" }}>
            <div style={{ fontWeight: 700, color: "#4c1d95", fontSize: "1.1rem" }}>Feedback<br/>Collection</div>
            <div style={{ position: "absolute", right: "-20px", top: "50%", transform: "translateY(-50%)", width: "80px", height: "80px", borderRadius: "50%", border: "1px solid #e9d5ff", background: "white", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: "10px" }}>
              <MessageSquare size={28} color="#4c1d95" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
