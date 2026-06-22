"use client";

import React, { useEffect, useState } from "react";
import { campaignsApi, offersApi } from "@/lib/api";
import { Plus } from "lucide-react";
import { PageHeader, Button } from "@/components/ui";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import { CampaignTable } from "@/components/campaigns/CampaignTable";
import { LaunchModal } from "@/components/campaigns/LaunchModal";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [type, setType] = useState("Promotional");
  const [offerId, setOfferId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [targetDateStart, setTargetDateStart] = useState("");
  const [targetDateEnd, setTargetDateEnd] = useState("");

  // Launch modal
  const [previewingCampaign, setPreviewingCampaign] = useState<any>(null);
  const [previewTargets, setPreviewTargets] = useState<any[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [c, o] = await Promise.all([campaignsApi.list(), offersApi.list()]);
      setCampaigns(c);
      setOffers(o);
    } catch {}
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await campaignsApi.create({
        name, type,
        custom_prompt: customPrompt || undefined,
        target_date_start: targetDateStart ? new Date(targetDateStart).toISOString() : undefined,
        target_date_end: targetDateEnd ? new Date(targetDateEnd).toISOString() : undefined,
        offer_id: offerId ? parseInt(offerId) : undefined,
        scheduled_at: new Date(scheduledAt).toISOString(),
      });
      setShowForm(false);
      setName(""); setType("Promotional"); setOfferId(""); setScheduledAt("");
      setCustomPrompt(""); setTargetDateStart(""); setTargetDateEnd("");
      const data = await campaignsApi.list();
      setCampaigns(data);
    } catch {}
  }

  async function openLaunchModal(campaign: any) {
    setPreviewingCampaign(campaign);
    setPreviewLoading(true);
    setPreviewTargets([]);
    setPreviewError(null);
    try {
      const targets = await campaignsApi.previewTargets(campaign.id);
      setPreviewTargets(Array.isArray(targets) ? targets : []);
    } catch (err: any) {
      setPreviewError(err?.message || "Failed to fetch target customers.");
    }
    setPreviewLoading(false);
  }

  async function handleLaunch() {
    if (!previewingCampaign) return;
    try {
      await campaignsApi.launch(previewingCampaign.id);
      const data = await campaignsApi.list();
      setCampaigns(data);
      setPreviewingCampaign(null);
    } catch {}
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await campaignsApi.delete(id);
      const data = await campaignsApi.list();
      setCampaigns(data);
    } catch {}
  }

  return (
    <div>
      <PageHeader
        title="Campaigns"
        subtitle="Launch AI-powered outbound calling campaigns"
        action={
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={16} /> New Campaign
          </Button>
        }
      />

      <CampaignForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreate}
        offers={offers}
        name={name} setName={setName}
        type={type} setType={setType}
        offerId={offerId} setOfferId={setOfferId}
        scheduledAt={scheduledAt} setScheduledAt={setScheduledAt}
        customPrompt={customPrompt} setCustomPrompt={setCustomPrompt}
        targetDateStart={targetDateStart} setTargetDateStart={setTargetDateStart}
        targetDateEnd={targetDateEnd} setTargetDateEnd={setTargetDateEnd}
      />

      <LaunchModal
        campaign={previewingCampaign}
        targets={previewTargets}
        loading={previewLoading}
        error={previewError}
        onConfirm={handleLaunch}
        onClose={() => setPreviewingCampaign(null)}
      />

      <div className="glass-card" style={{ overflow: "hidden" }}>
        <CampaignTable
          campaigns={campaigns}
          loading={loading}
          onLaunch={openLaunchModal}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
