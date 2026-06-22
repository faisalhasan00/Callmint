"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Megaphone,
  Phone,
  Settings,
  CreditCard,
  Bot,
  LogOut,
  Menu,
  X,
  Mic,
  Sun,
  Moon,
  Tag,
} from "lucide-react";
import { useTheme } from "next-themes";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/appointments", label: "Appointments", icon: Calendar },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/offers", label: "Offers", icon: Tag },
  { href: "/call-logs", label: "Call Logs", icon: Phone },
  { href: "/ai-config", label: "AI Config", icon: Bot },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: (val: boolean) => void }) {
  const pathname = usePathname();
  const { user, logout } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40
          }}
        />
      )}

      <aside
        style={{
          width: collapsed ? 72 : 260,
          minHeight: "100vh",
          background: "var(--color-bg-secondary)",
          borderRight: "1px solid var(--color-border)",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "fixed",
          top: 0,
          left: mobileOpen ? 0 : "var(--sidebar-left, 0)", // will be controlled via CSS classes or layout logic
          transform: mobileOpen ? "translateX(0)" : "var(--sidebar-transform, translateX(0))",
          zIndex: 50,
        }}
        className="sidebar-container"
      >
        {/* Logo & Toggle */}
        <div
          style={{
            padding: collapsed ? "20px 16px" : "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            borderBottom: "1px solid var(--color-border)",
            minHeight: 72,
          }}
        >
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image src="/Logos/callmint-icon-navy.png" alt="Callmint Logo" width={32} height={32} style={{ objectFit: "contain" }} />
              </div>
              <span
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "var(--color-text-primary)"
                }}
              >
                Callmint
              </span>
            </div>
          )}
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden-mobile"
            style={{
              background: "none",
              border: "none",
              color: "var(--color-text-secondary)",
              cursor: "pointer",
              padding: 4,
            }}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <Menu size={20} /> : <X size={18} />}
          </button>
        </div>

      {/* Navigation Links */}
      <nav
        style={{
          flex: 1,
          padding: collapsed ? "16px 8px" : "16px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive ? "active" : ""}`}
              style={{
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "12px" : undefined,
              }}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User info */}
      <div
        style={{
          padding: collapsed ? "16px 8px" : "16px",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="nav-link"
            style={{
              width: "100%",
              cursor: "pointer",
              background: "none",
              border: "none",
              color: "var(--color-text-secondary)",
              justifyContent: collapsed ? "center" : "flex-start",
              padding: collapsed ? "12px" : undefined,
              marginBottom: "8px",
            }}
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
          </button>
        )}

        {!collapsed && user && (
          <div
            style={{
              padding: "10px 12px",
              background: "var(--color-bg-card)",
              borderRadius: 8,
              marginBottom: 8,
              fontSize: "0.8rem",
            }}
          >
            <div style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>
              {user.email}
            </div>
            <div style={{ color: "var(--color-text-muted)", marginTop: 2 }}>
              {user.role}
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="nav-link"
          style={{
            width: "100%",
            cursor: "pointer",
            background: "none",
            border: "none",
            color: "var(--color-error)",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "12px" : undefined,
          }}
          title="Logout"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
    </>
  );
}
