import { useEffect } from "react";
import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { z } from "zod";
import { Settings } from "lucide-react";
import wordmark from "@/assets/arancini-wordmark.png";
import { DayStatusSheet } from "@/components/pilot/day-status-sheet";
import { DeviationSheet } from "@/components/pilot/deviation-sheet";
import { SettingsSheet } from "@/components/pilot/settings-sheet";
import { ThawSheet } from "@/components/pilot/thaw-sheet";
import { WeeklySheet } from "@/components/pilot/weekly-sheet";
import { useAppFrame } from "@/hooks/useAppFrame";
import { PilotProvider, usePilot } from "@/lib/pilot-core/context";
import { isoWeekNumber, todayOslo } from "@/lib/pilot-core";
import { tryOpenSheet } from "@/lib/sheetGate";
import { cn } from "@/lib/utils";

const Search = z.object({
  sheet: z.enum(["thaw", "status", "weekly", "deviation", "settings"]).optional(),
});

export type PilotSearch = z.infer<typeof Search>;

export const Route = createFileRoute("/pilot")({
  validateSearch: (s) => Search.parse(s),
  head: () => ({
    meta: [
      { title: "Pilot · Gold of Sicily" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "theme-color", content: "#f2ebe8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no",
      },
    ],
  }),
  component: PilotRoot,
});

function PilotRoot() {
  return (
    <PilotProvider>
      <PilotShell />
    </PilotProvider>
  );
}

function PilotShell() {
  useAppFrame();
  useEffect(() => {
    document.documentElement.classList.add("pilot-lock");
    return () => document.documentElement.classList.remove("pilot-lock");
  }, []);
  const { state } = usePilot();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const supplier = pathname.startsWith("/pilot/leverandor");

  const closeSheet = () => {
    void navigate({ to: ".", search: {} });
  };

  return (
    <div
      data-app="pilot"
      className="overflow-hidden bg-background text-foreground"
      style={{ height: "var(--app-height, 100dvh)" }}
    >
      <div className="mx-auto flex h-full max-w-2xl flex-col overflow-hidden px-5 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <header className="flex shrink-0 items-center gap-3 pb-3">
          <img src={wordmark} alt="Gold of Sicily" className="h-9 w-auto object-contain" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] uppercase tracking-[0.16em] text-tomato">Pilot Core</p>
            <p className="truncate text-sm font-semibold">{state.org.venueName}</p>
          </div>
          <div className="flex rounded-full bg-muted p-1 text-xs font-semibold">
            <Link
              to="/pilot"
              search={search}
              className={cn(
                "rounded-full px-3 py-1.5",
                !supplier ? "bg-card shadow-sm" : "text-muted-foreground",
              )}
            >
              Sted
            </Link>
            <Link
              to="/pilot/leverandor"
              search={search}
              className={cn(
                "rounded-full px-3 py-1.5",
                supplier ? "bg-card shadow-sm" : "text-muted-foreground",
              )}
            >
              Leverandør
            </Link>
          </div>
          <button
            type="button"
            onClick={() => tryOpenSheet(() => void navigate({ to: ".", search: { sheet: "settings" } }))}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-muted"
            aria-label="Innstillinger"
          >
            <Settings className="h-5 w-5" />
          </button>
        </header>

        <p className="mb-2 shrink-0 text-xs text-muted-foreground">
          Uke {isoWeekNumber(todayOslo())} · registrering erstatter manuell ukesrapport
        </p>

        <div className="min-h-0 flex-1 overflow-hidden pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <Outlet />
        </div>
      </div>

      {search.sheet === "thaw" ? <ThawSheet onClose={closeSheet} /> : null}
      {search.sheet === "status" ? <DayStatusSheet onClose={closeSheet} /> : null}
      {search.sheet === "weekly" ? <WeeklySheet onClose={closeSheet} /> : null}
      {search.sheet === "deviation" ? <DeviationSheet onClose={closeSheet} /> : null}
      {search.sheet === "settings" ? <SettingsSheet onClose={closeSheet} /> : null}
    </div>
  );
}
