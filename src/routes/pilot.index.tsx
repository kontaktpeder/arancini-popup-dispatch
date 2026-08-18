import { createFileRoute, getRouteApi, useNavigate } from "@tanstack/react-router";
import { StartPane } from "@/components/pilot/start-pane";
import { tryOpenSheet } from "@/lib/sheetGate";

export const Route = createFileRoute("/pilot/")({
  component: VenueHome,
});

const pilotRoute = getRouteApi("/pilot");

function VenueHome() {
  const navigate = useNavigate({ from: "/pilot/" });
  const search = pilotRoute.useSearch();

  const open = (sheet: "thaw" | "status" | "weekly" | "deviation") => {
    tryOpenSheet(() => {
      void navigate({ search: { ...search, sheet } });
    });
  };

  return (
    <StartPane
      onThaw={() => open("thaw")}
      onStatus={() => open("status")}
      onWeekly={() => open("weekly")}
      onDeviation={() => open("deviation")}
    />
  );
}
