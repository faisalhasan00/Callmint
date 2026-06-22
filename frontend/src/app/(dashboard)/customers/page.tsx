"use client";

import React, { useEffect, useState } from "react";
import { customersApi } from "@/lib/api";
import { getToken } from "@/lib/api";
import { Plus } from "lucide-react";
import { PageHeader, SearchBar, Button } from "@/components/ui";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { CustomerTable } from "@/components/customers/CustomerTable";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [monthsInput, setMonthsInput] = useState<Record<number, string>>({});

  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("Hinglish");
  const [addMonths, setAddMonths] = useState("");

  useEffect(() => { loadCustomers(); }, []);

  async function loadCustomers() {
    try {
      const data = await customersApi.list();
      setCustomers(data);
    } catch {}
    setLoading(false);
  }

  async function handleAddCustomer(e: React.FormEvent) {
    e.preventDefault();
    try {
      let subDate: string | null = null;
      if (addMonths && parseInt(addMonths) > 0) {
        const d = new Date();
        d.setMonth(d.getMonth() + parseInt(addMonths));
        subDate = d.toISOString();
      }
      await customersApi.create({ name, phone, preferred_language: language, subscription_end_date: subDate });
      setName(""); setPhone(""); setLanguage("Hinglish"); setAddMonths("");
      setShowForm(false);
      loadCustomers();
    } catch {}
  }

  async function handleAddSubscription(customer: any, monthsStr: string) {
    if (!monthsStr) return;
    const months = parseInt(monthsStr);
    if (isNaN(months) || months <= 0) return;
    const newDate = new Date();
    if (customer.subscription_end_date && new Date(customer.subscription_end_date) > new Date()) {
      newDate.setTime(new Date(customer.subscription_end_date).getTime());
    }
    newDate.setMonth(newDate.getMonth() + months);
    try {
      await fetch(`${API_BASE}/customers/${customer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ name: customer.name, phone: customer.phone, preferred_language: customer.preferred_language, subscription_end_date: newDate.toISOString() }),
      });
      loadCustomers();
      setMonthsInput((prev) => ({ ...prev, [customer.id]: "" }));
    } catch {}
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this customer?")) return;
    try { await customersApi.delete(id); loadCustomers(); } catch {}
  }

  const filtered = customers.filter(
    (c) => c.name?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search)
  );

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Manage your CRM contacts"
        action={
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={16} /> Add Customer
          </Button>
        }
      />

      <CustomerForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddCustomer}
        name={name} setName={setName}
        phone={phone} setPhone={setPhone}
        language={language} setLanguage={setLanguage}
        addMonths={addMonths} setAddMonths={setAddMonths}
      />

      <SearchBar value={search} onChange={setSearch} placeholder="Search by name or phone..." />

      <div className="glass-card" style={{ overflow: "hidden" }}>
        <CustomerTable
          customers={filtered}
          loading={loading}
          monthsInput={monthsInput}
          onMonthsChange={(id, val) => setMonthsInput((prev) => ({ ...prev, [id]: val }))}
          onAddSubscription={handleAddSubscription}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
