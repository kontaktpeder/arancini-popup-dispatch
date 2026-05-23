/** Delt popup-/brand-data — oppdater her ved hvert drop */
export const SITE = {
  name: "Gold of Sicily",
  domain: "https://goldofsicily.no",
  instagram: "https://www.instagram.com/goldofsicily/",
} as const;

export const CURRENT_POPUP = {
  slug: "sigurds-gate-may-2026",
  dateLabel: "Tirsdag 26. mai 2026",
  dateShort: "Tirsdag 26. mai",
  timeLabel: "18–20",
  addressShort: "Sigurds gate 7",
  addressFull: "Sigurds gate 7, Oslo",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sigurds+gate+7%2C+Oslo",
  mapsDeepLink: "maps://?q=Sigurds+gate+7,+Oslo",
  countdownTarget: "2026-05-26T16:00:00Z",
  startDate: "2026-05-26T18:00:00+02:00",
  endDate: "2026-05-26T20:00:00+02:00",
  scarcity: "Når batchen er tom, er den tom.",
  menu: [
    {
      name: "Classico",
      description: "Ragu, erter og pecorino — den du kjenner fra Palermo.",
    },
    {
      name: "Bianco",
      description: "Sitron, mozzarella og urter — lys og frisk inni, sprø utenpå.",
    },
    {
      name: "Nordic twist",
      description: "Sesongens fyll — spør hva som er i dagens batch.",
    },
  ],
} as const;

export const CURRENT_POPUP_EN = {
  dateLabel: "Tuesday May 26, 2026",
  dateShort: "Tuesday May 26",
  timeLabel: "18–20",
  addressShort: "Sigurds gate 7",
  addressFull: "Sigurds gate 7, Oslo",
  mapsUrl: CURRENT_POPUP.mapsUrl,
  scarcity: "When the batch is gone, it's gone.",
  menu: [
    {
      name: "Classico",
      description: "Ragu, peas and pecorino — the one you know from Palermo.",
    },
    {
      name: "Bianco",
      description:
        "Lemon, mozzarella and herbs — bright and fresh inside, crisp outside.",
    },
    {
      name: "Nordic twist",
      description: "Seasonal filling — ask what's in tonight's batch.",
    },
  ],
} as const;
