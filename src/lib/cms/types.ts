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
  cta_popup_label: string;
  cta_instagram_label: string;
};

export type NextPopupMenuItem = {
  name: string;
  description: string;
};

export type NextPopupContent = {
  seo_title: string;
  seo_description: string;
  eyebrow: string;
  title: string;
  date_label: string;
  time_label: string;
  address_short: string;
  address_full: string;
  maps_url: string;
  scarcity: string;
  intro_body: string;
  menu_heading: string;
  menu: NextPopupMenuItem[];
  cta_maps_label: string;
  cta_instagram_label: string;
  cta_what_is_label: string;
};

export type CmsContentMap = {
  "what-is-arancini": WhatIsAranciniContent;
  about: AboutContent;
  "next-popup": NextPopupContent;
};
