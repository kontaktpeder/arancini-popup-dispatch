import { cn } from "@/lib/utils";

export function FlowDiagram({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("font-medium leading-tight", className)}>
      <p className={cn("text-[11px] uppercase tracking-[0.18em] text-tomato", compact && "sr-only")}>
        Flyt
      </p>
      <p className={cn("mt-1 text-sm text-foreground/80", compact && "mt-0 text-xs")}>
        Levert → På fryselager → Tint → Solgt
      </p>
      <p className={cn("pl-[7.6rem] text-sm text-foreground/55", compact && "pl-[6.4rem] text-xs")}>
        ↘ Kassert
      </p>
    </div>
  );
}
