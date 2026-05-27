export type CmsSlug = "what-is-arancini" | "about" | "next-popup";

export type WhatIsAranciniContent = {
  seo_title: string;
  seo_description: string;
  eyebrow: string;
  title: string;
  intro_1: string;
  intro_2_before: string;
  intro_2_emphasis: string;
  intro_2_after: string;
  section_1_heading: string;
  section_1_body: string;
  section_2_heading: string;
  section_2_body: string;
  section_3_heading: string;
  section_3_body: string;
  cta_label: string;
};

export type AboutContent = {
  seo_title: string;
  seo_description: string;
  eyebrow: string;
  title: string;
  intro_1: string;
  intro_2: string;
  section_1_heading: string;
  section_1_body: string;
  section_2_heading: string;
  section_2_body: string;
  proof_heading: string;
  proof_body: string;
  cta_popup_label: string;
  cta_instagram_label: string;
};

export type NextPopupContent = {
  seo_title: string;
  seo_description: string;
  eyebrow: string;
  title: string;
  body: string;
  secondary_body: string;
  cta_label: string;
};

export type CmsContentMap = {
  "what-is-arancini": WhatIsAranciniContent;
  about: AboutContent;
  "next-popup": NextPopupContent;
};
