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
import { DISCOVERY_EN } from "@/lib/discovery-copy";
import { getPopupSettings } from "@/lib/popup/popup.functions";
import type { SitePopupSettings } from "@/lib/popup/types";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

const popupQuery = queryOptions({
  queryKey: ["site-popup-settings"],
  queryFn: () => getPopupSettings(),
});

export const Route = createFileRoute("/en/")({
  head: () => buildPageHead(PAGE_SEO["/en"]),
  loader: ({ context }) => context.queryClient.ensureQueryData(popupQuery),
  component: IndexEn,
});

const NEWSLETTER_COPY_EN = {
  label: "Get notified before the next drop",
  placeholder: "you@email.com",
  cta: "Sign up",
  success: "You're on the list. We'll let you know before the next popup.",
  exists: "You're already on the list — we'll be in touch.",
  error: "Something went wrong. Try again.",
  invalid: "Check the email address.",
};

function buildPopupCopyEn(s: SitePopupSettings) {
  if (s.popup_status === "coming_soon" || !s.venue) {
    return {
      eyebrow: "Next popup",
      status: "coming_soon" as const,
      title: "Next popup coming soon",
      body: "We're testing recipes, popup locations and collaborations around Oslo. Join the list to hear when the next drop is announced.",
    };
  }
  const parts = [s.date_short_en ?? s.date_short, s.time_label, s.address_short].filter(Boolean);
  return {
    eyebrow: "Next popup",
    status: "announced" as const,
    title: s.venue,
    body: parts.join(" · "),
    dateLabel: s.date_label_en ?? s.date_label ?? undefined,
    timeLabel: s.time_label ?? undefined,
    addressLabel: s.address_full ?? undefined,
    mapsGoogle: s.maps_google ?? undefined,
    mapsApple: s.maps_apple ?? undefined,
    countdownTarget: s.countdown_target ?? undefined,
    countdownLabels: {
      days: "days",
      hours: "hours",
      minutes: "min",
      seconds: "sec",
      live: "Live now",
    },
  };
}

function IndexEn() {
  const { data: popup } = useSuspenseQuery(popupQuery);
  const popupCopy = buildPopupCopyEn(popup);

  return (
    <main className="min-h-screen bg-background">
      <h1 className="sr-only">Gold of Sicily — Sicilian arancini in Oslo</h1>
      <LangSwitch lang="en" />
      <SiteHeader tagline={DISCOVERY_EN.heroIntro.body} />

      <HomeHero
        copy={{
          altArancini: "Arancini on crinkled paper",
          title: "Gold of Sicily",
          subtitle: "Sicilian arancini in Oslo",
          body: "Handmade Sicilian arancini. Small batches. Popups around Oslo.",
          proof: "4.5/5 on taste",
          ctaLabel: "Get notified before the next drop",
          scrollLabel: "Next popup",
          secondaryCtaLabel: "What is arancini?",
          secondaryCtaHref: "/en/what-is-arancini",
        }}
        newsletter={<NewsletterSignup lang="en" copy={NEWSLETTER_COPY_EN} />}
      />

      <NextBatch
        copy={popupCopy}
        newsletter={
          popupCopy.status === "coming_soon" ? (
            <NewsletterSignup lang="en" copy={NEWSLETTER_COPY_EN} />
          ) : undefined
        }
      />

      <Testimonials
        copy={{
          eyebrow: "From our guests",
          title: "What people said",
          quotes: [
            "Proper Sicilian street food, rich in flavour with a fine balance between the cheese and the salt.",
            "Crunchy, juicy delicacy.",
            "Fried risotto with insane flavour and great cheese pull.",
            "Beautiful Italian food.",
            "A delicious taste experience.",
            "Italian bar food that pops in your mouth with a beer alongside.",
          ],
        }}
      />

      <CollaborationInquiry lang="en" />

      <SocialFollow label="Follow the journey" />

      <EditorialCards copy={DISCOVERY_EN.editorial} />

      <SiteFooter copy={DISCOVERY_EN.footer} />
    </main>
  );
}
