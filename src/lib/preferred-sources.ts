import { SITE } from "./site";

/** Hidden until goldofsicily.no appears in Google's source preferences tool. */
export const PREFERRED_SOURCES_ENABLED = false;

export const PREFERRED_SOURCES_SCRIPT = "https://news.google.com/swg/js/v1/publisher.js";

export const PREFERRED_SOURCES_SCRIPT_ID = "google-preferred-sources-lib";

export function preferredSourcesHost() {
  return new URL(SITE.domain).hostname;
}

export function preferredSourcesDeeplink() {
  return `https://www.google.com/preferences/source?q=${preferredSourcesHost()}`;
}

export function ensurePreferredSourcesScript() {
  if (!PREFERRED_SOURCES_ENABLED) return;
  if (typeof document === "undefined") return;
  if (document.getElementById(PREFERRED_SOURCES_SCRIPT_ID)) return;
  if (document.querySelector(`script[src="${PREFERRED_SOURCES_SCRIPT}"]`)) return;

  const script = document.createElement("script");
  script.id = PREFERRED_SOURCES_SCRIPT_ID;
  script.async = true;
  script.src = PREFERRED_SOURCES_SCRIPT;
  document.head.appendChild(script);
}
