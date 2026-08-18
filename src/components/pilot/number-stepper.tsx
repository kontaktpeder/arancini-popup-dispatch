import { cn } from "@/lib/utils";

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 999,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {label ? <span className="mr-auto text-sm font-medium">{label}</span> : null}
      <button
        type="button"
        className="tap-target h-12 w-12 shrink-0 rounded-2xl border border-border bg-card text-xl font-semibold"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Minus"
      >
        −
      </button>
      <input
        inputMode="numeric"
        className={cn(
          "h-12 w-16 rounded-2xl border border-border bg-input text-center text-lg font-semibold tabular-nums",
        )}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value.replace(/\D/g, ""));
          if (Number.isNaN(n)) return;
          onChange(Math.min(max, Math.max(min, n)));
        }}
      />
      <button
        type="button"
        className="tap-target h-12 w-12 shrink-0 rounded-2xl border border-border bg-card text-xl font-semibold"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Pluss"
      >
        +
      </button>
    </div>
  );
}
