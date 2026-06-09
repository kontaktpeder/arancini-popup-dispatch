/** Delt brand-data */
export const SITE = {
  name: "Gold of Sicily",
  domain: "https://goldofsicily.no",
  instagram: "https://www.instagram.com/goldofsicily/",
  tiktok: "https://www.tiktok.com/@goldofsicily",
} as const;

export const CURRENT_POPUP = {
  slug: "klink-vulkan-june-2026",
  venue: "Klink Vulkan",
  addressShort: "Klink Vulkan · Vulkan 9",
  addressFull: "Klink Vulkan, Vulkan 9, Oslo",
  dateLabel: "Tirsdag 9. juni 2026",
  dateShort: "Tirsdag 9. juni",
  timeLabel: "12–17",
  startDate: "2026-06-09T12:00:00+02:00",
  endDate: "2026-06-09T17:00:00+02:00",
  countdownTarget: "2026-06-09T10:00:00Z",
  mapsGoogle:
    "https://www.google.com/maps/search/?api=1&query=Klink+Vulkan,+Vulkan+9,+Oslo",
  mapsApple: "maps://?q=Klink+Vulkan,+Vulkan+9,+Oslo",
} as const;

export const CURRENT_POPUP_EN = {
  ...CURRENT_POPUP,
  dateLabel: "Tuesday June 9, 2026",
  dateShort: "Tuesday June 9",
} as const;
