"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthenticated, loadUser, loadSubscription } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      loadSubscription();
    }
  }, [isLoading, isAuthenticated, loadSubscription]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-bg-primary)",
        }}
      >
        <div className="shimmer" style={{ width: 200, height: 40, borderRadius: 10 }} />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-bg-primary)" }}>
      {/* Topbar for mobile */}
      <div className="mobile-topbar" style={{
        display: "none", // Will be overridden by CSS on mobile
        alignItems: "center",
        padding: "16px 20px",
        background: "var(--color-bg-secondary)",
        borderBottom: "1px solid var(--color-border)",
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 30,
      }}>
        <button 
          onClick={() => setMobileOpen(true)}
          style={{ background: "none", border: "none", color: "var(--color-text-primary)", cursor: "pointer" }}
        >
          <Menu size={24} />
        </button>
        <span style={{ marginLeft: 16, fontWeight: 700, color: "var(--color-text-primary)" }}>Callmint</span>
      </div>

      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <main
        className="main-content"
        style={{
          flex: 1,
          marginLeft: 260, // Desktop margin
          padding: "32px 40px",
          background: "var(--color-bg-primary)",
          minHeight: "100vh",
          transition: "margin-left 0.3s ease",
        }}
      >
        {children}
      </main>
    </div>
  );
}
