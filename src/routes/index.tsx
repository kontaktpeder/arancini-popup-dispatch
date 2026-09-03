import { createFileRoute } from "@tanstack/react-router";
import { BrandHome } from "@/components/brand-home";
import { fetchPublicVenues } from "@/lib/portal-venues";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => buildPageHead(PAGE_SEO["/"]),
  loader: () => fetchPublicVenues("no"),
  component: Index,
});

function Index() {
  const venues = Route.useLoaderData();
  return (
    <main>
      <BrandHome lang="no" venues={venues} />
    </main>
  );
}
