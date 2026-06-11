import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";

import { CollaborationInquiry } from "@/components/collaboration-inquiry";
import { EditorialCards } from "@/components/editorial-cards";
import { HomeHero } from "@/components/home-hero";
import { LangSwitch } from "@/components/lang-switch";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { NextBatch } from "@/components/next-batch";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SocialFollow } from "@/components/social-follow";
import { Testimonials } from "@/components/testimonials";
import { DISCOVERY_NO } from "@/lib/discovery-copy";
import { getPopupSettings } from "@/lib/popup/popup.functions";
import type { SitePopupSettings } from "@/lib/popup/types";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

const popupQuery = queryOptions({
  queryKey: ["site-popup-settings"],
  queryFn: () => getPopupSettings(),
});

export const Route = createFileRoute("/")({
  head: () => buildPageHead(PAGE_SEO["/"]),
  loader: ({ context }) => context.queryClient.ensureQueryData(popupQuery),
  component: Index,
});

const NEWSLETTER_COPY_NO = {
  label: "​",
  placeholder: "din@epost.no",
  cta: "Meld på",
  success: "Du er på listen. Vi sier ifra før neste popup.",
  exists: "Du er allerede på listen — vi sier ifra.",
  error: "Noe gikk galt. Prøv igjen.",
  invalid: "Sjekk e-postadressen.",
};

function buildPopupCopyNo(s: SitePopupSettings) {
  if (s.popup_status === "coming_soon" || !s.venue) {
    return {
      eyebrow: "Neste popup",
      status: "coming_soon" as const,
      title: "Neste popup kommer snart",
      body: "Vi tester oppskrifter, popup-lokasjoner og samarbeid rundt i Oslo. Meld deg på listen for å få beskjed når neste drop annonseres.",
    };
  }
  const parts = [s.date_short, s.time_label, s.address_short].filter(Boolean);
  return {
    eyebrow: "Neste popup",
    status: "announced" as const,
    title: s.venue,
    body: parts.join(" · "),
    dateLabel: s.date_label ?? undefined,
    timeLabel: s.time_label ?? undefined,
    addressLabel: s.address_full ?? undefined,
    mapsGoogle: s.maps_google ?? undefined,
    mapsApple: s.maps_apple ?? undefined,
    countdownTarget: s.countdown_target ?? undefined,
    countdownLabels: {
      days: "dager",
      hours: "timer",
      minutes: "min",
      seconds: "sek",
      live: "Live nå",
    },
  };
}

function Index() {
  const { data: popup } = useSuspenseQuery(popupQuery);
  const popupCopy = buildPopupCopyNo(popup);

  return (
    <main className="min-h-screen bg-background">
      <h1 className="sr-only">Gold of Sicily — sicilianske arancini i Oslo</h1>
      <LangSwitch lang="no" />
      <SiteHeader tagline={DISCOVERY_NO.heroIntro.body} />

      <HomeHero
        copy={{
          altArancini: "Arancini på krøllet papir",
          title: "Gold of Sicily",
          subtitle: "Sicilianske arancini i Oslo",
          body: "Håndlagde sicilianske arancini. Små batcher. Popups rundt i Oslo.",
          proof: "4,5/5 i smak",
          ctaLabel: "Bli varslet før neste drop",
          scrollLabel: "Neste popup",
          secondaryCtaLabel: "Hva er arancini?",
          secondaryCtaHref: "/what-is-arancini",
        }}
        newsletter={<NewsletterSignup lang="no" copy={NEWSLETTER_COPY_NO} />}
      />

      <NextBatch
        copy={popupCopy}
        newsletter={
          popupCopy.status === "coming_soon" ? (
            <NewsletterSignup lang="no" copy={NEWSLETTER_COPY_NO} />
          ) : undefined
        }
      />

      <Testimonials
        copy={{
          eyebrow: "Fra gjestene",
          title: "Hva folk sa",
          quotes: [
            "Skikkelig siciliansk street food, rik på smak og med fin balanse mellom osten og det salte.",
            "Kronsjy, saftig delikatesse.",
            "Fritert risotto med sykt mye smak og bra cheese pull.",
            "Nydelig italiensk mat.",
            "En digg smaksopplevelse.",
            "Italiensk barmat som smeller i kjeften med en øl til.",
          ],
        }}
      />

      <CollaborationInquiry lang="no" />

      <SocialFollow label="Følg reisen" />

      <EditorialCards copy={DISCOVERY_NO.editorial} />

      <SiteFooter copy={DISCOVERY_NO.footer} />
    </main>
  );
}
