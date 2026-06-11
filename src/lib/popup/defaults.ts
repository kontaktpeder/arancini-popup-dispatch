import type { SitePopupSettings } from "./types";

export const POPUP_DEFAULTS: Omit<SitePopupSettings, "id" | "updated_at"> = {
  popup_status: "coming_soon",
  venue: null,
  date_label: null,
  date_label_en: null,
  date_short: null,
  date_short_en: null,
  time_label: null,
  address_short: null,
  address_full: null,
  maps_google: null,
  maps_apple: null,
  countdown_target: null,
};
