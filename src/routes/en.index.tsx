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
import { DISCOVERY_EN } from "@/lib/discovery-copy";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/en/")({
  head: () => buildPageHead(PAGE_SEO["/en"]),
  component: IndexEn,
});

const NEWSLETTER_COPY_EN = {
  label: "​",
  placeholder: "you@email.com",
  cta: "Sign up",
  success: "You'll hear from us when the next batch is ready.",
  exists: "You're already on the list — we'll be in touch.",
  error: "Something went wrong. Try again.",
  invalid: "Check the email address.",
};

function IndexEn() {
  return (
    <main className="min-h-screen bg-background">
      <h1 className="sr-only">Gold of Sicily — Sicilian arancini in Oslo</h1>
      <LangSwitch lang="en" />
      <SiteHeader tagline={DISCOVERY_EN.heroIntro.body} />

      <HomeHero
        copy={{
          altArancini: "Arancini on crinkled paper",
          title: "Sicilian arancini in Oslo",
          body: "Handmade rice balls with a crisp shell, warm filling and the flavour of Sicilian street food. Our first popup at Sigurds gate 7 made one thing clear: Oslo wants more.",
          proof: "4.5/5 on taste · 28 of 34 would buy again",
          ctaLabel: "Get notified about the next popup",
          scrollLabel: "What people said",
        }}
        newsletter={<NewsletterSignup lang="en" copy={NEWSLETTER_COPY_EN} />}
      />

      <Testimonials
        copy={{
          eyebrow: "Voices from batch 001",
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

      <Favorites
        copy={{
          eyebrow: "Batch 001 · 34 tasters",
          title: "The people's favourite",
          items: [
            { name: "Truffle & mushroom", votes: 16, voteLabel: "votes" },
            { name: "Ragu", votes: 11, voteLabel: "votes" },
            { name: "'Nduja", votes: 9, voteLabel: "votes" },
          ],
        }}
      />

      <NextBatch
        copy={{
          eyebrow: "Next popup",
          title: "Next batch coming soon",
          body: "We're planning the next popup now. Sign up to hear first — batches are small.",
        }}
        newsletter={<NewsletterSignup lang="en" copy={NEWSLETTER_COPY_EN} />}
      />

      <SocialFollow label="Follow us" />

      <EditorialCards copy={DISCOVERY_EN.editorial} />

      <SiteFooter copy={DISCOVERY_EN.footer} />
    </main>
  );
}
