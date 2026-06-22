"use client";

import React, { useEffect, useState } from "react";
import { configsApi } from "@/lib/api";
import { Bot, Save, Globe, FileText, Sparkles, CheckCircle2, AlertCircle, Play } from "lucide-react";

export default function AIConfigPage() {
  const [config, setConfig] = useState({
    voice_style: "Professional Female",
    language: "Hinglish",
    custom_system_prompt: "",
    custom_greeting: "",
  });
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [aiData, templatesData] = await Promise.all([
        configsApi.getAI(),
        configsApi.getTemplates(),
      ]);
      setConfig({
        voice_style: aiData.voice_style || "Professional Female",
        language: aiData.language || "Hinglish",
        custom_system_prompt: aiData.custom_system_prompt || "",
        custom_greeting: aiData.custom_greeting || "",
      });
      setTemplates(templatesData);
    } catch (err: any) {
      setErrorMsg("Failed to load AI configuration");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await configsApi.updateAI(config);
      setSuccessMsg("AI Configuration saved successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update configuration");
    } finally {
      setSaving(false);
    }
  }

  function applyTemplate(template: any) {
    const defaultPrompts: Record<string, string> = {
      "Default Salon Template": 
        "You are an AI Voice Receptionist for a premium Salon. Speak politely and naturally in Telugu, Hindi, and Hinglish. Your primary tasks are:\n1. Assist customers with salon bookings (ask for services like Haircut, Beard Styling, Hair Spa, Facial, preferred date and time).\n2. Answer questions about business timings (9:00 AM to 8:00 PM) and pricing.\n3. Keep your answers brief, concise, and conversational. Avoid very long sentences.\n4. When booking, verify slots first and request customer's phone number.",
      "Default SuperMart Template":
        "You are an AI Voice Assistant for a local SuperMart. Speak naturally in Telugu, Hindi, and Hinglish. Your primary tasks are:\n1. Answer customer queries about timings (8:00 AM to 10:00 PM) and product availability.\n2. Guide them on current promotional offers and weekend discounts.\n3. Maintain a warm, friendly, and helpful tone.\n4. Keep responses short and conversational.",
    };

    const templateName = template.name;
    const promptText = defaultPrompts[templateName] || `You are an AI Assistant for a ${templateName.includes("Salon") ? "Salon" : "SuperMart"}. Help customers book slots, answer queries about timings, and guide them in Hindi, Telugu, and Hinglish.`;

    setConfig((prev) => ({
      ...prev,
      custom_greeting: template.template_json?.greeting || prev.custom_greeting,
      custom_system_prompt: promptText,
    }));
    setSuccessMsg(`Applied preset inputs from "${templateName}". Review and click Save.`);
    setTimeout(() => setSuccessMsg(""), 4000);
  }

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div className="shimmer" style={{ width: 300, height: 40, borderRadius: 10 }} />
        <div className="shimmer" style={{ width: "100%", height: 350, borderRadius: 16 }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Title */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em" }}>AI Voice Agent Config</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>
          Fine-tune your virtual voice employee's behaviour, voice style, and greeting presets.
        </p>
      </div>

      {successMsg && (
        <div
          className="badge-success animate-fade-in"
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={16} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div
          className="badge-error animate-fade-in"
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
        {/* Settings Form */}
        <div className="glass-card animate-fade-in" style={{ padding: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <Bot size={22} color="var(--color-accent-primary-light)" />
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Voice Settings & Prompting</h2>
          </div>

          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>
                  Voice Selection
                </label>
                <select
                  className="input-field"
                  value={config.voice_style}
                  onChange={(e) => setConfig({ ...config, voice_style: e.target.value })}
                >
                  <option>Professional Female</option>
                  <option>Professional Male</option>
                  <option>Friendly Female</option>
                  <option>Casual Male</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>
                  Primary Language
                </label>
                <select
                  className="input-field"
                  value={config.language}
                  onChange={(e) => setConfig({ ...config, language: e.target.value })}
                >
                  <option>Hinglish</option>
                  <option>Hindi</option>
                  <option>Telugu</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>
                Custom Greeting
              </label>
              <textarea
                className="input-field"
                style={{ minHeight: 90, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }}
                placeholder="Namaste, welcome to our shop. How can I help you today?"
                value={config.custom_greeting}
                onChange={(e) => setConfig({ ...config, custom_greeting: e.target.value })}
                required
              />
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: 4, display: "block" }}>
                This is the first sentence spoken when the AI answers the phone. Keep it welcoming.
              </span>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>
                AI Behavior Instructions (System Prompt)
              </label>
              <textarea
                className="input-field"
                style={{ minHeight: 200, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5, fontSize: "0.85rem" }}
                placeholder="Define who the AI is, what they should offer, and how they should answer..."
                value={config.custom_system_prompt}
                onChange={(e) => setConfig({ ...config, custom_system_prompt: e.target.value })}
              />
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: 4, display: "block" }}>
                Write instructions on booking appointments, services description, business hours, and language priority.
              </span>
            </div>

            <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start", width: "100%", justifyContent: "center", height: 44 }} disabled={saving}>
              <Save size={18} /> {saving ? "Saving..." : "Save AI Configuration"}
            </button>
          </form>
        </div>

        {/* Templates Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="glass-card animate-fade-in animate-delay-1" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Sparkles size={20} color="var(--color-warning)" />
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Predefined Templates</h2>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: 20, lineHeight: 1.4 }}>
              Apply one of these curated business templates to automatically set up greetings and standard conversational guidelines.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {templates.map((tpl, i) => (
                <div
                  key={i}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: "var(--color-bg-secondary)",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{tpl.name}</span>
                    <span className="badge badge-info" style={{ fontSize: "0.7rem", textTransform: "capitalize" }}>
                      {tpl.type || "inbound"}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--color-text-secondary)",
                      background: "rgba(0, 0, 0, 0.2)",
                      padding: 12,
                      borderRadius: 8,
                      borderLeft: "2px solid var(--color-accent-primary)",
                      fontStyle: "italic",
                    }}
                  >
                    "{tpl.template_json?.greeting}"
                  </div>

                  {tpl.template_json?.services && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {tpl.template_json.services.map((srv: string, idx: number) => (
                        <span key={idx} className="badge badge-success" style={{ fontSize: "0.65rem", padding: "1px 8px" }}>
                          {srv}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => applyTemplate(tpl)}
                    className="btn-secondary"
                    style={{ width: "100%", justifyContent: "center", padding: "8px 12px", fontSize: "0.8rem", gap: 6 }}
                  >
                    <FileText size={14} /> Apply Template & Load Prompts
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Test Call Info */}
          <div className="glass-card animate-fade-in animate-delay-2" style={{ padding: 24, borderLeft: "4px solid var(--color-accent-primary)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Globe size={18} color="var(--color-accent-primary-light)" />
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Real-Time Language Support</h3>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              Our engine dynamically listens for <strong>Telugu</strong>, <strong>Hindi</strong>, and <strong>English</strong>. It automatically switches response language when customers shift languages during the call, maintaining context seamlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
