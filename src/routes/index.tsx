import { createFileRoute } from "@tanstack/react-router";
import { EditorialCards } from "@/components/editorial-cards";
import { HomeHero } from "@/components/home-hero";
import { LangSwitch } from "@/components/lang-switch";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SocialFollow } from "@/components/social-follow";
import { Testimonials } from "@/components/testimonials";
import { DISCOVERY_NO } from "@/lib/discovery-copy";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => buildPageHead(PAGE_SEO["/"]),
  component: Index,
});

const NEWSLETTER_COPY_NO = {
  label: "​",
  placeholder: "din@epost.no",
  cta: "Meld på",
  success: "Du er på listen. Vi holder deg oppdatert.",
  exists: "Du er allerede på listen — vi holder deg oppdatert.",
  error: "Noe gikk galt. Prøv igjen.",
  invalid: "Sjekk e-postadressen.",
};

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <h1 className="sr-only">Siciliansk arancini fra Sicilia til Oslo</h1>
      <LangSwitch lang="no" />
      <SiteHeader tagline={DISCOVERY_NO.heroIntro.body} />

      <HomeHero
        copy={{
          altArancini: "Arancini på krøllet papir",
          title: "Siciliansk arancini fra Sicilia til Oslo",
          subtitle: "Gold of Sicily",
          body: "Vi produserer frossen arancini for barer som vil tilby varm mat når kjøkkenet er stengt — eller som ikke har fullt kjøkken.",
          proof: "4,5/5 i smak",
          ctaLabel: "Få produktnyheter og vite hvor arancini blir tilgjengelig",
          scrollLabel: "For barer",
          primaryCtaHref: "/for-barer",
          secondaryCtaLabel: "Hva er arancini?",
          secondaryCtaHref: "/what-is-arancini",
        }}
        newsletter={<NewsletterSignup lang="no" copy={NEWSLETTER_COPY_NO} />}
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

      <SocialFollow label="Følg reisen" />

      <EditorialCards copy={DISCOVERY_NO.editorial} />

      <SiteFooter copy={DISCOVERY_NO.footer} />
    </main>
  );
}
