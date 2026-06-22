"use client";

import React, { useEffect, useState } from "react";
import { offersApi } from "@/lib/api";
import { Tag, Plus, Trash } from "lucide-react";

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");

  useEffect(() => {
    loadOffers();
  }, []);

  async function loadOffers() {
    try {
      const data = await offersApi.list();
      setOffers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await offersApi.create({
        title,
        description,
        discount_percentage: parseFloat(discount),
        is_active: true
      });
      setShowForm(false);
      setTitle("");
      setDescription("");
      setDiscount("");
      loadOffers();
    } catch (err) {
      alert("Failed to create offer.");
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Offers</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>
            Create and manage promotional discounts
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> New Offer
        </button>
      </div>

      {showForm && (
        <div className="glass-card animate-fade-in" style={{ padding: 24, marginBottom: 24 }}>
          <form onSubmit={handleCreate} style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>Offer Title</label>
              <input className="input-field" placeholder="e.g. Eid Special 50% Off" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div style={{ minWidth: 100, width: 120 }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>Discount %</label>
              <input type="number" step="0.1" className="input-field" placeholder="20" value={discount} onChange={(e) => setDiscount(e.target.value)} required />
            </div>
            
            <div style={{ width: "100%", marginTop: 8 }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 6 }}>
                Description (Optional)
              </label>
              <textarea 
                className="input-field" 
                style={{ width: "100%", height: 60, resize: "vertical" }}
                placeholder="Details for the AI to understand the rules of the offer..."
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
            
            <button type="submit" className="btn-primary" style={{ height: 42, width: "100%", justifyContent: "center" }}>Save Offer</button>
          </form>
        </div>
      )}

      <div className="glass-card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40 }}>
            <div className="shimmer" style={{ width: "100%", height: 200, borderRadius: 12 }} />
          </div>
        ) : offers.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", color: "var(--color-text-muted)" }}>
            <Tag size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p>No offers created yet.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Discount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Tag size={14} color="var(--color-accent-primary)" />
                      {o.title}
                    </div>
                    {o.description && <div style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", marginTop: 4 }}>{o.description}</div>}
                  </td>
                  <td style={{ fontWeight: "bold", color: "var(--color-success)" }}>{o.discount_percentage}% OFF</td>
                  <td><span className={o.is_active ? "badge badge-success" : "badge badge-warning"}>{o.is_active ? "Active" : "Inactive"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
