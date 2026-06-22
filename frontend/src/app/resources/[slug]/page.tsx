import React, { use } from "react";
import RichArticleTemplate from "@/components/landing/RichArticleTemplate";
import { resourcesContent } from "@/lib/contentData";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const unwrappedParams = await params;
  const content = resourcesContent[unwrappedParams.slug];
  if (!content) return {};

  return {
    title: content.seoTitle || content.title,
    description: content.seoDescription || content.subtitle,
  };
}

export default function ResourcesPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = use(params);
  const content = resourcesContent[unwrappedParams.slug];
  if (!content) return notFound();

  return <RichArticleTemplate content={content} />;
}
