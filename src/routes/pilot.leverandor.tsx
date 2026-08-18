import { createFileRoute, getRouteApi, useNavigate } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { SupplierPane } from "@/components/pilot/supplier-pane";
import { tryOpenSheet } from "@/lib/sheetGate";

export const Route = createFileRoute("/pilot/leverandor")({
  component: SupplierHome,
});

const pilotRoute = getRouteApi("/pilot");

function SupplierHome() {
  const navigate = useNavigate({ from: "/pilot/leverandor" });
  const search = pilotRoute.useSearch();

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <button
        type="button"
        className="tap-target h-12 w-full gap-2 bg-tomato text-blush"
        onClick={() =>
          tryOpenSheet(() => void navigate({ search: { ...search, sheet: "deviation" } }))
        }
      >
        <AlertTriangle className="h-4 w-4" />
        Rapporter avvik
      </button>
      <div className="min-h-0 flex-1 overflow-hidden">
        <SupplierPane />
      </div>
    </div>
  );
}
