import { createFileRoute } from "@tanstack/react-router";
import { EditorialCards } from "@/components/editorial-cards";
import { HomeHero } from "@/components/home-hero";
import { LangSwitch } from "@/components/lang-switch";
import { NewsletterSignup } from "@/components/newsletter-signup";
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
  success: "You're on the list. We'll keep you updated.",
  exists: "You're already on the list — we'll keep you updated.",
  error: "Something went wrong. Try again.",
  invalid: "Check the email address.",
};

function IndexEn() {
  return (
    <main className="min-h-screen bg-background">
      <h1 className="sr-only">Sicilian arancini, made in Oslo</h1>
      <LangSwitch lang="en" />
      <SiteHeader tagline={DISCOVERY_EN.heroIntro.body} />

      <HomeHero
        copy={{
          altArancini: "Arancini on crinkled paper",
          title: "Sicilian arancini, made in Oslo",
          subtitle: "Gold of Sicily",
          body: "Inspired by the traditions of Sicily. We make frozen arancini for bars that want to serve hot food after the kitchen closes — or without a full kitchen.",
          proof: "4.5/5 on taste",
          ctaLabel: "Get product news and find out where arancini becomes available",
          scrollLabel: "For bars",
          primaryCtaHref: "/en/for-bars",
          secondaryCtaLabel: "What is arancini?",
          secondaryCtaHref: "/en/what-is-arancini",
        }}
        newsletter={<NewsletterSignup lang="en" copy={NEWSLETTER_COPY_EN} />}
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

      <SocialFollow label="Follow the journey" />

      <EditorialCards copy={DISCOVERY_EN.editorial} />

      <SiteFooter copy={DISCOVERY_EN.footer} />
    </main>
  );
}
