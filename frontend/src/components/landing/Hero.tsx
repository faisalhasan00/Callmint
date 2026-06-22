"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section style={{
      padding: "100px 5% 60px",
      textAlign: "center",
      position: "relative",
      background: "radial-gradient(circle at top, #fdfcff 0%, #ffffff 100%)",
      overflow: "hidden"
    }}>
      {/* Subtle background lines/grid simulation */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3, zIndex: 0, backgroundImage: "linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)", backgroundSize: "40px 100%" }} />
      
      <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}
        >
          AI-POWERED ASSISTANT FOR LOCAL BUSINESSES
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "#2e1065", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "24px" }}
        >
          AI Customer Service Agent That Never Misses a Call
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ fontSize: "1.1rem", color: "#475569", lineHeight: 1.6, marginBottom: "40px", maxWidth: "700px", margin: "0 auto 40px" }}
        >
          Callmint brings AI efficiency to your local business. It manages calls, seamlessly books appointments, and proactively runs outbound promotional campaigns in Hindi, Telugu, and English.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}
        >
          <Button 
            variant="primary" 
            style={{ background: "#ef4444", color: "white", padding: "16px 36px", fontSize: "1rem", borderRadius: "12px", border: "1px solid #b91c1c", boxShadow: "0 4px 14px rgba(239, 68, 68, 0.3)" }}
            onClick={() => window.open("https://wa.me/918332063638", "_blank")}
          >
            Schedule Demo
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
