import { createFileRoute, notFound } from "@tanstack/react-router";
import { VenueDetail } from "@/components/venue-detail";
import { fetchPublicVenue } from "@/lib/portal-venues";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/en/venues/$slug")({
  loader: async ({ params }) => {
    const venue = await fetchPublicVenue(params.slug, "en");
    if (!venue) throw notFound();
    return venue;
  },
  head: ({ loaderData }) =>
    buildPageHead({
      title: loaderData ? `${loaderData.name} — Gold of Sicily` : "Gold of Sicily",
      description: loaderData
        ? `Gold of Sicily is served at ${loaderData.name}${loaderData.city ? ` in ${loaderData.city}` : ""}.`
        : "Gold of Sicily is served at selected venues.",
      path: loaderData ? `/en/venues/${loaderData.slug}` : "/en/find-us",
      locale: "en_GB",
    }),
  component: VenuePageEn,
});

function VenuePageEn() {
  const venue = Route.useLoaderData();
  return <VenueDetail lang="en" venue={venue} />;
}
