"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, setToken } from "@/lib/api";
import { Mic } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("Salon");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await authApi.register({
          email,
          password,
          business_name: businessName,
          business_type: businessType,
        });
        // Auto-login after register
        const tokenData = await authApi.login({ email, password });
        setToken(tokenData.access_token);
        router.push("/billing");
      } else {
        const tokenData = await authApi.login({ email, password });
        setToken(tokenData.access_token);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg-primary)",
        padding: 24,
      }}
    >
      {/* Decorative gradient orbs */}
      <div
        style={{
          position: "fixed",
          top: -200,
          right: -200,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: -200,
          left: -200,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="glass-card animate-fade-in"
        style={{
          width: "100%",
          maxWidth: 440,
          padding: 40,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              marginBottom: 16,
            }}
          >
            <Mic size={28} color="#fff" />
          </div>
          <h1
            style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}
            className="gradient-text"
          >
            Callmint
          </h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.85rem",
              marginTop: 8,
            }}
          >
            {isRegister
              ? "Create your business account"
              : "Sign in to your dashboard"}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 10,
              color: "var(--color-error)",
              fontSize: "0.8rem",
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--color-text-secondary)",
                marginBottom: 6,
              }}
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--color-text-secondary)",
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isRegister && (
            <>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                    marginBottom: 6,
                  }}
                >
                  Business Name
                </label>
                <input
                  id="register-business-name"
                  type="text"
                  className="input-field"
                  placeholder="XYZ Salon"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                    marginBottom: 6,
                  }}
                >
                  Business Type
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                  {["Salon", "SuperMart"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBusinessType(type)}
                      style={{
                        flex: 1,
                        padding: "10px 16px",
                        borderRadius: 10,
                        border:
                          businessType === type
                            ? "2px solid var(--color-accent-primary)"
                            : "1px solid var(--color-border)",
                        background:
                          businessType === type
                            ? "rgba(99,102,241,0.1)"
                            : "var(--color-bg-secondary)",
                        color:
                          businessType === type
                            ? "var(--color-accent-primary-light)"
                            : "var(--color-text-secondary)",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        transition: "all 0.2s ease",
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            id="login-submit"
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "12px 20px",
              fontSize: "0.9rem",
              marginTop: 8,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: "0.8rem",
            color: "var(--color-text-muted)",
          }}
        >
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-accent-primary-light)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.8rem",
            }}
          >
            {isRegister ? "Sign In" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
