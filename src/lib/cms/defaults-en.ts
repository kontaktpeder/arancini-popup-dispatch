import type { CmsContentMap } from "./types";
import { CURRENT_POPUP_EN } from "@/lib/site";

export const CMS_DEFAULTS_EN: CmsContentMap = {
  "what-is-arancini": {
    seo_title: "What is arancini? — Gold of Sicily",
    seo_description:
      "Sicilian rice balls with a crisp shell and filling from Palermo. How Gold of Sicily makes handmade arancini in Oslo — popup street food in small batches.",
    eyebrow: "Guide",
    title: "What is arancini?",
    intro_1:
      "Arancini are Sicilian rice balls: rice shaped around a filling, breaded and fried until the shell is crisp. Inside it should be soft, savoury and a little \"wet\" in the good way — like in the streets of Palermo, not like frozen snacks.",
    intro_2_before: "The name comes from ",
    intro_2_emphasis: "arancina",
    intro_2_after:
      " — little orange — because the classic round ones can look like an orange. In eastern Sicily they are often pointed; in Oslo you meet both traditions through craft, not factory.",
    section_1_heading: "Arancini in Oslo",
    section_1_body:
      "People search for \"arancini oslo\", \"sicilian rice balls\" and \"what is arancini\" because they have tasted it somewhere — or almost. Gold of Sicily is a popup concept: small batches, a clear menu per night, and quality before volume.",
    section_2_heading: "How we make them",
    section_2_body:
      "Rice that gets time, fillings with ragu, cheese or season, breading that handles heat without turning greasy — and serving while there is still weight and juice inside. It's street food, not corporate restaurant SEO.",
    cta_label: "See the next popup →",
  },
  about: {
    seo_title: "About Gold of Sicily",
    seo_description:
      "Popup street food from Sicily to Oslo. Why Gold of Sicily started, small batches, and arancini culture — without corporate fluff.",
    eyebrow: "About",
    title: "Sicily, in small batches",
    intro_1:
      "Gold of Sicily started with a simple question: why aren't there real, Sicilian arancini as street food in Oslo — crisp, soft, with fillings that actually taste of something — without turning into an \"Italian restaurant\" experience?",
    intro_2:
      "We are popup and street food: Dennis and the team bake batches when there is a date and a place, not every day all year round. That means you get what's fresh that night — and when the batch is gone, it's gone.",
    section_1_heading: "Sicily, not corporate",
    section_1_body:
      "The inspiration comes from Palermo — the sound of frying, paper, people eating standing up. We don't want to write \"we are passionate about food\". We want to serve arancini that feel real, physical and a little raw on the edges — like fashion meeting street food.",
    section_2_heading: "Small batches",
    section_2_body:
      "Smaller batches mean better control of rice, filling and crisp. It is also why this was missing: it doesn't scale like a chain, but it tastes better.",
    cta_popup_label: "Next popup →",
    cta_instagram_label: "Instagram",
  },
  "next-popup": {
    seo_title: "Next popup — Gold of Sicily",
    seo_description: `Next arancini batch in Oslo: ${CURRENT_POPUP_EN.dateLabel}, ${CURRENT_POPUP_EN.timeLabel} at ${CURRENT_POPUP_EN.addressShort}. Limited menu — ${CURRENT_POPUP_EN.scarcity}`,
    eyebrow: "Next popup",
    title: "Sicilian arancini in Oslo — one night, one batch",
    date_label: CURRENT_POPUP_EN.dateLabel,
    time_label: CURRENT_POPUP_EN.timeLabel,
    address_short: CURRENT_POPUP_EN.addressShort,
    address_full: CURRENT_POPUP_EN.addressFull,
    maps_url: CURRENT_POPUP_EN.mapsUrl,
    scarcity: CURRENT_POPUP_EN.scarcity,
    intro_body:
      "We pop up with a small batch of handmade arancini — not a restaurant with a fixed menu, but street food from Sicily: crisp outside, soft inside, filling that tastes of Palermo.",
    menu_heading: "Menu this night",
    menu: CURRENT_POPUP_EN.menu.map((m) => ({ ...m })),
    cta_maps_label: "Find us on the map →",
    cta_instagram_label: "Follow us on Instagram",
    cta_what_is_label: "New here? Read what arancini is →",
  },
};
