import { createFileRoute } from "@tanstack/react-router";

import { EditorialCards } from "@/components/editorial-cards";
import { Favorites } from "@/components/favorites";
import { HomeHero } from "@/components/home-hero";
import { LangSwitch } from "@/components/lang-switch";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { NextBatch } from "@/components/next-batch";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SocialFollow } from "@/components/social-follow";
import { Testimonials } from "@/components/testimonials";
import { DISCOVERY_NO } from "@/lib/discovery-copy";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";
import { CURRENT_POPUP } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => buildPageHead(PAGE_SEO["/"]),
  component: Index,
});

const NEWSLETTER_COPY_NO = {
  label: "​",
  placeholder: "din@epost.no",
  cta: "Meld på",
  success: "Du får beskjed når neste batch er klar.",
  exists: "Du er allerede påmeldt — vi sier ifra.",
  error: "Noe gikk galt. Prøv igjen.",
  invalid: "Sjekk e-postadressen.",
};

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <h1 className="sr-only">Gold of Sicily — sicilianske arancini i Oslo</h1>
      <LangSwitch lang="no" />
      <SiteHeader tagline={DISCOVERY_NO.heroIntro.body} />

      <HomeHero
        copy={{
          altArancini: "Arancini på krøllet papir",
          title: "Sicilianske arancini i Oslo",
          body: "Håndlagde risballer med sprø skorpe, varmt fyll og smaken av siciliansk streetfood. Første popup i Sigurds gate 7 viste én ting: Oslo vil ha mer.",
          proof: "4,5/5 i smak · 28 av 34 ville kjøpt igjen",
          ctaLabel: "Få beskjed om neste popup",
          scrollLabel: "Hva folk sa",
        }}
        newsletter={<NewsletterSignup lang="no" copy={NEWSLETTER_COPY_NO} />}
      />

      <NextBatch
        copy={{
          eyebrow: "Popup nå",
          title: CURRENT_POPUP.venue,
          body: `${CURRENT_POPUP.dateShort} · ${CURRENT_POPUP.timeLabel} · ${CURRENT_POPUP.addressShort}`,
          dateLabel: CURRENT_POPUP.dateLabel,
          timeLabel: CURRENT_POPUP.timeLabel,
          addressLabel: CURRENT_POPUP.addressFull,
          mapsGoogle: CURRENT_POPUP.mapsGoogle,
          mapsApple: CURRENT_POPUP.mapsApple,
          countdownTarget: CURRENT_POPUP.countdownTarget,
          countdownLabels: {
            days: "dager",
            hours: "timer",
            minutes: "min",
            seconds: "sek",
            live: "Live nå",
          },
        }}
        newsletter={<NewsletterSignup lang="no" copy={NEWSLETTER_COPY_NO} />}
      />

      <Testimonials
        copy={{
          eyebrow: "Stemmer fra batch 001",
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

      <Favorites
        copy={{
          eyebrow: "Batch 001 · 34 smakere",
          title: "Folkets favoritt",
          items: [
            { name: "Trøffel og sopp", votes: 16, voteLabel: "stemmer" },
            { name: "Ragu", votes: 11, voteLabel: "stemmer" },
            { name: "'Nduja", votes: 9, voteLabel: "stemmer" },
          ],
        }}
      />

      <NextBatch
        copy={{
          eyebrow: "Popup nå",
          title: CURRENT_POPUP.venue,
          body: `${CURRENT_POPUP.dateShort} · ${CURRENT_POPUP.timeLabel} · ${CURRENT_POPUP.addressShort}`,
          dateLabel: CURRENT_POPUP.dateLabel,
          timeLabel: CURRENT_POPUP.timeLabel,
          addressLabel: CURRENT_POPUP.addressFull,
          mapsGoogle: CURRENT_POPUP.mapsGoogle,
          mapsApple: CURRENT_POPUP.mapsApple,
          countdownTarget: CURRENT_POPUP.countdownTarget,
          countdownLabels: {
            days: "dager",
            hours: "timer",
            minutes: "min",
            seconds: "sek",
            live: "Live nå",
          },
        }}
        newsletter={<NewsletterSignup lang="no" copy={NEWSLETTER_COPY_NO} />}
      />

      <SocialFollow label="Følg oss" />

      <EditorialCards copy={DISCOVERY_NO.editorial} />

      <SiteFooter copy={DISCOVERY_NO.footer} />
    </main>
  );
}
