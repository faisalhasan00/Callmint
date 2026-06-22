"use client";

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ArrowRight, CheckCircle2, Building2, Languages } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface RichPageContent {
  title: string;
  subtitle: string;
  seoTitle: string;
  seoDescription: string;
  heroImage?: string;
  introduction: string[];
  problem?: { heading: string, items: string[], conclusion: string };
  whatIs?: { heading: string, items: string[], conclusion: string };
  howItWorks?: { heading: string, steps: { title: string, description: string, example?: string }[] };
  benefits?: { heading: string, items: { title: string, description: string }[] };
  industries?: { heading: string, items: { title: string, items: string[] }[] };
  languages?: boolean;
  example?: { heading: string, intro: string, withoutAi: string[], withAi: string[], result: string[] };
  conclusion: string[];
  faq?: { question: string, answer: string }[];
  cta: { heading: string, subtitle: string };
}

export default function RichArticleTemplate({ content }: { content: RichPageContent }) {
  // Generate JSON-LD for AI Bots and SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": content.seoTitle || content.title,
    "description": content.seoDescription || content.subtitle,
    "image": content.heroImage || "https://callmint.ai/Logos/callmint-primary-logo.png",
    "author": {
      "@type": "Organization",
      "name": "Callmint",
      "url": "https://callmint.ai"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Callmint",
      "logo": {
        "@type": "ImageObject",
        "url": "https://callmint.ai/Logos/callmint-primary-logo.png"
      }
    },
    ...(content.faq && {
      "mainEntity": content.faq.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    })
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "var(--font-geist-sans)" }}>
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
              {content.title}
            </h1>
            <p style={{ fontSize: "1.25rem", color: "#475569", lineHeight: 1.6 }}>
              {content.subtitle}
            </p>
          </div>
        </section>

        <section style={{ padding: "64px 24px", maxWidth: "900px", margin: "0 auto", color: "#334155", fontSize: "1.1rem", lineHeight: 1.8 }}>
          
          {/* Introduction */}
          <div style={{ marginBottom: "64px" }}>
            {content.introduction.map((paragraph, idx) => (
              <p key={idx} style={{ marginBottom: "24px", fontSize: idx === 0 ? "1.25rem" : "1.1rem", fontWeight: idx === 0 ? 500 : 400, color: idx === 0 ? "#0f172a" : "inherit" }}>
                {paragraph}
              </p>
            ))}
            
            {content.heroImage && (
              <div style={{ marginTop: "40px", borderRadius: "16px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                <img src={content.heroImage} alt={content.title} style={{ width: "100%", height: "auto", display: "block" }} />
              </div>
            )}
          </div>

          {/* The Problem */}
          {content.problem && (
            <div style={{ marginBottom: "64px" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#0f172a", marginBottom: "24px" }}>
                {content.problem.heading}
              </h2>
              <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "16px", marginBottom: "32px" }}>
                {content.problem.items.map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <CheckCircle2 color="#ef4444" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p style={{ fontStyle: "italic", borderLeft: "4px solid #cbd5e1", paddingLeft: "16px" }}>
                {content.problem.conclusion}
              </p>
            </div>
          )}

          {/* What Is */}
          {content.whatIs && (
            <div style={{ marginBottom: "64px" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#0f172a", marginBottom: "24px" }}>
                {content.whatIs.heading}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                {content.whatIs.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f0fdf4", padding: "16px", borderRadius: "8px", border: "1px solid #bbf7d0", color: "#166534", fontWeight: 500 }}>
                    <CheckCircle2 size={20} />
                    {item}
                  </div>
                ))}
              </div>
              <p>{content.whatIs.conclusion}</p>
            </div>
          )}

          {/* How It Works */}
          {content.howItWorks && (
            <div style={{ marginBottom: "64px", background: "#f8fafc", padding: "40px", borderRadius: "24px", border: "1px solid #e2e8f0" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#0f172a", marginBottom: "32px", textAlign: "center" }}>
                {content.howItWorks.heading}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {content.howItWorks.steps.map((step, i) => (
                  <div key={i} style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#4c1d95", marginBottom: "8px" }}>Step {i + 1}: {step.title}</h3>
                    <p style={{ marginBottom: step.example ? "12px" : "0" }}>{step.description}</p>
                    {step.example && (
                      <div style={{ background: "#f1f5f9", padding: "16px", borderRadius: "8px", fontStyle: "italic", borderLeft: "4px solid #4c1d95" }}>
                        "{step.example}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {content.benefits && (
            <div style={{ marginBottom: "64px" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#0f172a", marginBottom: "32px" }}>
                {content.benefits.heading}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                {content.benefits.items.map((benefit, i) => (
                  <div key={i} style={{ padding: "24px", background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f3e8ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#7e22ce", marginBottom: "16px" }}>
                      <span style={{ fontSize: "1.5rem", fontWeight: 700 }}>{i + 1}</span>
                    </div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Industries */}
          {content.industries && (
            <div style={{ marginBottom: "64px" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#0f172a", marginBottom: "32px" }}>
                {content.industries.heading}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {content.industries.items.map((industry, i) => (
                  <div key={i} style={{ background: "#f8fafc", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                    <h3 style={{ fontWeight: 700, color: "#0f172a", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Building2 color="#4c1d95" size={20}/> {industry.title}
                    </h3>
                    <ul style={{ listStyle: "disc", paddingLeft: "24px" }}>
                      {industry.items.map((item, j) => <li key={j}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {content.languages && (
            <div style={{ marginBottom: "64px", display: "flex", gap: "32px", alignItems: "center", background: "#f0fdf4", padding: "32px", borderRadius: "24px", border: "1px solid #bbf7d0" }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#166534", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <Languages size={32} /> AI Voice Agents in Regional Languages
                </h2>
                <p style={{ marginBottom: "16px", color: "#166534" }}>India is a multilingual market. Modern AI voice agents can communicate in:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
                  {["Hindi", "Telugu", "Tamil", "Kannada", "Malayalam", "Marathi", "Bengali", "English"].map((lang, i) => (
                    <span key={i} style={{ background: "white", color: "#166534", padding: "8px 16px", borderRadius: "20px", fontWeight: 600, border: "1px solid #86efac" }}>{lang}</span>
                  ))}
                </div>
                <p style={{ color: "#166534", fontWeight: 500 }}>This improves customer engagement and trust significantly.</p>
              </div>
            </div>
          )}

          {/* Real Business Example */}
          {content.example && (
            <div style={{ marginBottom: "64px" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#0f172a", marginBottom: "24px" }}>
                {content.example.heading}
              </h2>
              <p style={{ marginBottom: "24px" }}>{content.example.intro}</p>
              
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 300px", background: "#fef2f2", padding: "24px", borderRadius: "16px", border: "1px solid #fecaca" }}>
                  <h3 style={{ fontWeight: 700, color: "#991b1b", marginBottom: "16px" }}>Without AI:</h3>
                  <ul style={{ listStyle: "disc", paddingLeft: "24px", color: "#991b1b" }}>
                    {content.example.withoutAi.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div style={{ flex: "1 1 300px", background: "#f0fdfa", padding: "24px", borderRadius: "16px", border: "1px solid #ccfbf1" }}>
                  <h3 style={{ fontWeight: 700, color: "#115e59", marginBottom: "16px" }}>With AI Automation:</h3>
                  <ul style={{ listStyle: "disc", paddingLeft: "24px", color: "#115e59" }}>
                    {content.example.withAi.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                  <div style={{ marginTop: "24px", padding: "16px", background: "white", borderRadius: "8px", fontWeight: 700, color: "#0f766e" }}>
                    Result:<br/>
                    {content.example.result.map((item, i) => <span key={i}>✔ {item}<br/></span>)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conclusion */}
          <div style={{ marginBottom: "64px" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#0f172a", marginBottom: "24px" }}>
              Conclusion
            </h2>
            {content.conclusion.map((paragraph, idx) => (
              <p key={idx} style={{ marginBottom: "24px", fontWeight: idx === content.conclusion.length - 1 ? 600 : 400, color: idx === content.conclusion.length - 1 ? "#0f172a" : "inherit", borderLeft: idx === content.conclusion.length - 1 ? "4px solid #8b5cf6" : "none", paddingLeft: idx === content.conclusion.length - 1 ? "16px" : "0" }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* FAQ */}
          {content.faq && (
            <div style={{ marginBottom: "64px" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#0f172a", marginBottom: "32px" }}>
                Frequently Asked Questions
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {content.faq.map((item, i) => (
                  <div key={i} style={{ background: "#f8fafc", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <h3 style={{ fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>{item.question}</h3>
                    <p>{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{ background: "#4c1d95", padding: "48px", borderRadius: "24px", textAlign: "center", color: "white" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "16px" }}>
              {content.cta.heading}
            </h2>
            <p style={{ fontSize: "1.2rem", marginBottom: "32px", opacity: 0.9 }}>
              {content.cta.subtitle}
            </p>
            <Button size="lg" style={{ background: "white", color: "#4c1d95", fontSize: "1.1rem", padding: "0 32px" }}>
              Get Started Now <ArrowRight size={20} style={{ marginLeft: "8px" }} />
            </Button>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
