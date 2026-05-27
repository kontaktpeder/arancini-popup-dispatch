import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { SocialFollow } from "@/components/social-follow";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";
import { CMS_DEFAULTS_EN } from "@/lib/cms/defaults-en";

const NEWSLETTER_COPY_EN = {
  label: "Get notified first",
  placeholder: "you@email.com",
  cta: "Sign up",
  success: "You'll hear from us when the next batch is ready.",
  exists: "You're already on the list — we'll be in touch.",
  error: "Something went wrong. Try again.",
  invalid: "Check the email address.",
};

export const Route = createFileRoute("/en/next-popup")({
  head: () => buildPageHead(PAGE_SEO["/en/next-popup"]),
  component: NextPopupEn,
});

function NextPopupEn() {
  const c = CMS_DEFAULTS_EN["next-popup"];
  return (
    <ContentPage lang="en" eyebrow={c.eyebrow} title={c.title}>
      <p>{c.body}</p>
      {c.secondary_body ? (
        <p className="italic text-muted-foreground">{c.secondary_body}</p>
      ) : null}

      <div className="mt-2">
        <NewsletterSignup
          lang="en"
          copy={{ ...NEWSLETTER_COPY_EN, label: c.cta_label }}
        />
      </div>

      <div className="mt-6">
        <SocialFollow label="Follow us" />
      </div>
    </ContentPage>
  );
}
