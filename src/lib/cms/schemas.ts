import { z } from "zod";
import type { CmsContentMap, CmsSlug } from "./types";

const str = (max = 5000) => z.string().min(1).max(max);
const optStr = (max = 5000) => z.string().max(max).default("");

export const whatIsAranciniSchema = z.object({
  seo_title: str(160),
  seo_description: str(300),
  eyebrow: str(80),
  title: str(160),
  intro_1: str(2000),
  intro_2_before: optStr(2000),
  intro_2_emphasis: optStr(160),
  intro_2_after: optStr(2000),
  section_1_heading: str(160),
  section_1_body: str(2000),
  section_2_heading: str(160),
  section_2_body: str(2000),
  section_3_heading: optStr(160),
  section_3_body: optStr(2000),
  cta_label: str(120),
});

export const aboutSchema = z.object({
  seo_title: str(160),
  seo_description: str(300),
  eyebrow: str(80),
  title: str(160),
  intro_1: str(2000),
  intro_2: str(2000),
  section_1_heading: str(160),
  section_1_body: str(2000),
  section_2_heading: str(160),
  section_2_body: str(2000),
  proof_heading: optStr(160),
  proof_body: optStr(2000),
  cta_popup_label: str(120),
  cta_instagram_label: str(120),
});

export const nextPopupSchema = z.object({
  seo_title: str(160),
  seo_description: str(300),
  eyebrow: str(80),
  title: str(200),
  body: str(2000),
  secondary_body: optStr(2000),
  cta_label: str(120),
});

export const CMS_SCHEMAS = {
  "what-is-arancini": whatIsAranciniSchema,
  about: aboutSchema,
  "next-popup": nextPopupSchema,
} as const;

export type CmsParsed<S extends CmsSlug> = CmsContentMap[S];

export const SLUGS: CmsSlug[] = ["what-is-arancini", "about", "next-popup"];

export const SLUG_LABELS: Record<CmsSlug, string> = {
  "what-is-arancini": "Hva er arancini",
  about: "Om oss",
  "next-popup": "Neste popup",
};
