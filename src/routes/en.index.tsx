import { createFileRoute } from "@tanstack/react-router";


import { EditorialCards } from "@/components/editorial-cards";
import { FeedbackSection } from "@/components/feedback-section";
import { NewsletterSignup } from "@/components/newsletter-signup";

import { SiteHeader } from "@/components/site-header";
import { LangSwitch } from "@/components/lang-switch";
import { Poster } from "@/components/poster";
import { SiteFooter } from "@/components/site-footer";
import { DISCOVERY_EN } from "@/lib/discovery-copy";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";
import { CURRENT_POPUP_EN } from "@/lib/site";

export const Route = createFileRoute("/en/")({
  head: () => buildPageHead(PAGE_SEO["/en"]),
  component: IndexEn,
});

function IndexEn() {
  return (
    <main className="min-h-screen bg-background">
      <h1 className="sr-only">Gold of Sicily — Sicilian arancini in Oslo</h1>
      <LangSwitch lang="en" />
      <SiteHeader tagline={DISCOVERY_EN.heroIntro.body} />

      <FeedbackSection
        tallyUrl="https://tally.so/r/rjkYqN"
        newsletter={
          <NewsletterSignup
            lang="en"
            copy={{
              label: "Hear about the next popup",
              placeholder: "you@email.com",
              cta: "Sign up",
              success: "You'll hear from us before the next popup.",
              exists: "You're already on the list — we'll be in touch.",
              error: "Something went wrong. Try again.",
              invalid: "Check the email address.",
            }}
          />
        }
        copy={{
          eyebrow: "Batch",
          followLabel: "Follow us",

          title: "Help us shape Gold of Sicily",
          body: "We're making small batches of Sicilian arancini in Oslo and testing the concept live. Tasted one? Tell us what you think — flavour, price, what we should make more of.",
          microNote: "Under 30 seconds",
          cta: "Give feedback",
          qrLabel: "Scan to answer",
          formTitle: "Live · Batch 001",
          stats: [
            { value: "100", label: "pcs only" },
            { value: "3", label: "fillings" },
            { value: "01", label: "first popup" },
          ],
        }}
      />

      <Poster
        copy={{

          altArancini: "Arancini on crinkled paper",
          tagTop: "Crispy outside.",
          tagBottom: "Soft inside.",
          subtitle: "Sicilian street food",
          nextLabel: "Next popup",
          date: CURRENT_POPUP_EN.dateShort,
          address: `${CURRENT_POPUP_EN.timeLabel} · ${CURRENT_POPUP_EN.addressShort}`,
          scarcity: CURRENT_POPUP_EN.scarcity,
          follow: "Follow on Instagram",
          countdownTarget: "2026-05-26T16:00:00Z",
          countdownLabels: {
            days: "Days",
            hours: "Hours",
            minutes: "Min",
            seconds: "Sec",
            live: "We're live — come by!",
          },
        }}
      />

      <EditorialCards copy={DISCOVERY_EN.editorial} />
      
      
      <SiteFooter copy={DISCOVERY_EN.footer} />
    </main>
  );
}
