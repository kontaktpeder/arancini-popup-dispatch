import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { SocialFollow } from "@/components/social-follow";
import { buildPageHead } from "@/lib/seo";
import { getCmsPage } from "@/lib/cms/cms.functions";
import type { NextPopupContent } from "@/lib/cms/types";

const NEWSLETTER_COPY_NO = {
  label: "Få beskjed først",
  placeholder: "din@epost.no",
  cta: "Meld på",
  success: "Du får beskjed når neste batch er klar.",
  exists: "Du er allerede på listen — vi sier ifra.",
  error: "Noe gikk galt. Prøv igjen.",
  invalid: "Sjekk e-postadressen.",
};

export const Route = createFileRoute("/next-popup")({
  loader: () => getCmsPage({ data: "next-popup" }),
  head: ({ loaderData }) => {
    const c = loaderData as NextPopupContent | undefined;
    return buildPageHead({
      title: c?.seo_title,
      description: c?.seo_description,
      path: "/next-popup",
    });
  },
  component: NextPopupPage,
});

function NextPopupPage() {
  const c = Route.useLoaderData() as NextPopupContent;
  return (
    <ContentPage eyebrow={c.eyebrow} title={c.title}>
      <p>{c.body}</p>
      {c.secondary_body ? (
        <p className="italic text-muted-foreground">{c.secondary_body}</p>
      ) : null}

      <div className="mt-2">
        <NewsletterSignup
          lang="no"
          copy={{ ...NEWSLETTER_COPY_NO, label: c.cta_label }}
        />
      </div>

      <div className="mt-6">
        <SocialFollow label="Følg oss" />
      </div>
    </ContentPage>
  );
}
