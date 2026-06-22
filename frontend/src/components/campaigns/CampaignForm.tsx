"use client";
import React from "react";
import { Plus } from "lucide-react";
import { FormField, Card, Button, Input, Select, Textarea } from "@/components/ui";

interface CampaignFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  offers: any[];
  name: string; setName: (v: string) => void;
  type: string; setType: (v: string) => void;
  offerId: string; setOfferId: (v: string) => void;
  scheduledAt: string; setScheduledAt: (v: string) => void;
  customPrompt: string; setCustomPrompt: (v: string) => void;
  targetDateStart: string; setTargetDateStart: (v: string) => void;
  targetDateEnd: string; setTargetDateEnd: (v: string) => void;
}

export function CampaignForm({
  isOpen, onClose, onSubmit, offers,
  name, setName, type, setType, offerId, setOfferId,
  scheduledAt, setScheduledAt, customPrompt, setCustomPrompt,
  targetDateStart, setTargetDateStart, targetDateEnd, setTargetDateEnd,
}: CampaignFormProps) {
  return (
    <Card style={{ padding: 24, marginBottom: 24 }}>
      <form onSubmit={onSubmit} style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
        <FormField label="Campaign Name" style={{ flex: 1, minWidth: 180 }}>
          <Input placeholder="e.g. Summer Offer" value={name} onChange={(e) => setName(e.target.value)} required />
        </FormField>

        <FormField label="Type" style={{ minWidth: 140 }}>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option>Promotional</option>
            <option>Subscription Renewal</option>
            <option>Follow-up</option>
            <option>Festival</option>
            <option>Custom Goal</option>
          </Select>
        </FormField>

        <FormField label="Linked Offer" style={{ minWidth: 160 }}>
          <Select value={offerId} onChange={(e) => setOfferId(e.target.value)}>
            <option value="">None</option>
            {offers.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
          </Select>
        </FormField>

        <FormField label="Schedule" style={{ flex: 1, minWidth: 200 }}>
          <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} required />
        </FormField>

        <div style={{ width: "100%", display: "flex", gap: 12, marginTop: 8 }}>
          <FormField label="Target Customers From (Optional)" style={{ flex: 1 }}>
            <Input type="date" value={targetDateStart} onChange={(e) => setTargetDateStart(e.target.value)} />
          </FormField>
          <FormField label="Target Customers To (Optional)" style={{ flex: 1 }}>
            <Input type="date" value={targetDateEnd} onChange={(e) => setTargetDateEnd(e.target.value)} />
          </FormField>
        </div>

        <FormField label="Custom Goal / Instructions for AI (Optional)" style={{ width: "100%", marginTop: 8 }}>
          <Textarea
            style={{ width: "100%", height: 60 }}
            placeholder="e.g. Remind customer membership expires in 2 days."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
          />
        </FormField>

        <div style={{ display: "flex", gap: 8, width: "100%" }}>
          <Button type="submit" variant="primary" style={{ flex: 1 }}>
            <Plus size={16} /> Create Campaign
          </Button>
          <Button type="button" variant="secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
