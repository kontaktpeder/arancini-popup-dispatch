import { createFileRoute, notFound } from "@tanstack/react-router";
import { VenueDetail } from "@/components/venue-detail";
import { fetchPublicVenue } from "@/lib/portal-venues";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/steder/$slug")({
  loader: async ({ params }) => {
    const venue = await fetchPublicVenue(params.slug, "no");
    if (!venue) throw notFound();
    return venue;
  },
  head: ({ loaderData }) =>
    buildPageHead({
      title: loaderData ? `${loaderData.name} — Gold of Sicily` : "Gold of Sicily",
      description: loaderData
        ? `Gold of Sicily serveres hos ${loaderData.name}${loaderData.city ? ` i ${loaderData.city}` : ""}.`
        : "Gold of Sicily serveres på utvalgte steder.",
      path: loaderData ? `/steder/${loaderData.slug}` : "/finn-oss",
    }),
  component: VenuePageNo,
});

function VenuePageNo() {
  const venue = Route.useLoaderData();
  return <VenueDetail lang="no" venue={venue} />;
}
