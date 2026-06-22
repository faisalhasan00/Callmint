"use client";

import React from "react";
import Link from "next/link";
import { 
  PhoneCall,
  Mail,
  Globe,
  MessageSquare
} from "lucide-react";

export default function Footer() {
  const platformLinks = [
    { label: "Voice AI for Sales", path: "/platform/sales" },
    { label: "Voice AI for Support", path: "/platform/support" },
    { label: "Voice AI for Business", path: "/platform/business" },
    { label: "Inbound Call Handling", path: "/platform/inbound" },
    { label: "Pricing", path: "/pricing" }
  ];

  const industryLinks = [
    { label: "Salons & Spas", path: "/industries/salons" },
    { label: "Supermarkets", path: "/industries/supermarkets" },
    { label: "Real Estate", path: "/industries/real-estate" },
    { label: "Healthcare", path: "/industries/healthcare" },
    { label: "E-commerce", path: "/industries/ecommerce" },
    { label: "Education", path: "/industries/education" }
  ];

  const resourceLinks = [
    { label: "Blogs", path: "/resources/blogs" },
    { label: "Integrations", path: "/resources/integrations" },
    { label: "Voice AI Compliance", path: "/resources/compliance" },
    { label: "Case Studies", path: "/resources/case-studies" },
    { label: "Events", path: "/resources/events" }
  ];

  const companyLinks = [
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/company/contact" },
    { label: "Privacy Policy", path: "/company/privacy" },
    { label: "Terms & Conditions", path: "/company/terms" },
    { label: "Cancellation & Refund", path: "/company/cancellation" },
    { label: "Shipping & Delivery", path: "/company/shipping" }
  ];

  return (
    <div style={{ background: "#e9d5ff", padding: "60px 5%" }}>
      <footer style={{ 
        maxWidth: "1400px", 
        margin: "0 auto", 
        background: "#ffffff", 
        borderRadius: "24px", 
        border: "2px solid #0f172a",
        padding: "60px",
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
        gap: "40px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
      }}>
        
        {/* Logo & Contact Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <img src="/Logos/callmint-primary-logo.png" alt="Callmint" style={{ height: "40px", width: "auto", display: "block" }} />
          </Link>
          <div style={{ fontSize: "0.95rem", color: "#64748b", fontWeight: 500 }}>Voice AI Solution</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#4c1d95", fontWeight: 600, fontSize: "0.95rem" }}>
              <Mail size={20} /> hello@callmint.ai
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#4c1d95", fontWeight: 600, fontSize: "0.95rem" }}>
              <PhoneCall size={20} /> +91 83320 63638
            </div>
          </div>

          {/* Social / Contact Icons */}
          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <a href="https://www.linkedin.com/company/callmint/about/?viewAsMember=true" target="_blank" rel="noreferrer" style={{ width: "40px", height: "40px", borderRadius: "10px", border: "2px solid #0f172a", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background="#f8fafc"} onMouseOut={e => e.currentTarget.style.background="transparent"}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="https://www.instagram.com/callmint.app?utm_source=qr&igsh=ZmRzeTk0djJxZWdn" target="_blank" rel="noreferrer" style={{ width: "40px", height: "40px", borderRadius: "10px", border: "2px solid #0f172a", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background="#f8fafc"} onMouseOut={e => e.currentTarget.style.background="transparent"}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61591151494068&sk=directory_category" target="_blank" rel="noreferrer" style={{ width: "40px", height: "40px", borderRadius: "10px", border: "2px solid #0f172a", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background="#f8fafc"} onMouseOut={e => e.currentTarget.style.background="transparent"}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          </div>
        </div>

        {/* Platform Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h4 style={{ color: "#4c1d95", fontWeight: 700, fontSize: "1.05rem", marginBottom: "8px" }}>Platform</h4>
          {platformLinks.map((link, i) => (
            <Link key={i} href={link.path} style={{ color: "#475569", textDecoration: "none", fontSize: "0.95rem", fontWeight: 500, transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color="#4c1d95"} onMouseOut={e => e.currentTarget.style.color="#475569"}>{link.label}</Link>
          ))}
        </div>

        {/* Industries Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h4 style={{ color: "#4c1d95", fontWeight: 700, fontSize: "1.05rem", marginBottom: "8px" }}>Industries</h4>
          {industryLinks.map((link, i) => (
            <Link key={i} href={link.path} style={{ color: "#475569", textDecoration: "none", fontSize: "0.95rem", fontWeight: 500, transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color="#4c1d95"} onMouseOut={e => e.currentTarget.style.color="#475569"}>{link.label}</Link>
          ))}
        </div>

        {/* Resources Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h4 style={{ color: "#4c1d95", fontWeight: 700, fontSize: "1.05rem", marginBottom: "8px" }}>Resources</h4>
          {resourceLinks.map((link, i) => (
            <Link key={i} href={link.path} style={{ color: "#475569", textDecoration: "none", fontSize: "0.95rem", fontWeight: 500, transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color="#4c1d95"} onMouseOut={e => e.currentTarget.style.color="#475569"}>{link.label}</Link>
          ))}
        </div>

        {/* Company Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h4 style={{ color: "#4c1d95", fontWeight: 700, fontSize: "1.05rem", marginBottom: "8px" }}>Company</h4>
          {companyLinks.map((link, i) => (
            <Link key={i} href={link.path} style={{ color: "#475569", textDecoration: "none", fontSize: "0.95rem", fontWeight: 500, transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color="#4c1d95"} onMouseOut={e => e.currentTarget.style.color="#475569"}>{link.label}</Link>
          ))}
        </div>

      </footer>
    </div>
  );
}
