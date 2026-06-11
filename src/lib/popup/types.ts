export type PopupStatus = "announced" | "coming_soon";

export type SitePopupSettings = {
  id: string;
  popup_status: PopupStatus;
  venue: string | null;
  date_label: string | null;
  date_label_en: string | null;
  date_short: string | null;
  date_short_en: string | null;
  time_label: string | null;
  address_short: string | null;
  address_full: string | null;
  maps_google: string | null;
  maps_apple: string | null;
  countdown_target: string | null;
  updated_at: string;
};
