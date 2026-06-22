"use client";
import React from "react";
import { Plus } from "lucide-react";
import { FormField, Card, Button, Input, Select } from "@/components/ui";

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  name: string; setName: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  language: string; setLanguage: (v: string) => void;
  addMonths: string; setAddMonths: (v: string) => void;
}

export function CustomerForm({
  isOpen, onClose, onSubmit,
  name, setName, phone, setPhone,
  language, setLanguage, addMonths, setAddMonths,
}: CustomerFormProps) {
  return (
    <Card style={{ padding: 24, marginBottom: 24 }}>
      <form onSubmit={onSubmit} style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
        <FormField label="Name" style={{ flex: 1, minWidth: 180 }}>
          <Input placeholder="Customer name" value={name} onChange={(e) => setName(e.target.value)} required />
        </FormField>

        <FormField label="Phone" style={{ flex: 1, minWidth: 180 }}>
          <Input placeholder="+91XXXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </FormField>

        <FormField label="Language" style={{ minWidth: 140 }}>
          <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option>Hinglish</option>
            <option>Hindi</option>
            <option>Telugu</option>
          </Select>
        </FormField>

        <FormField label="Paid Months (Optional)" style={{ flex: 1, minWidth: 120 }}>
          <Input type="number" placeholder="e.g. 3" value={addMonths} onChange={(e) => setAddMonths(e.target.value)} min="1" />
        </FormField>

        <div style={{ display: "flex", gap: 8 }}>
          <Button type="submit" variant="primary" style={{ height: 42 }}>
            <Plus size={14} /> Save
          </Button>
          <Button type="button" variant="secondary" style={{ height: 42 }} onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
