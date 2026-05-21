import { useEffect, useState } from "react";

type Labels = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  live: string;
};

function getDiff(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

export function Countdown({
  target,
  labels,
}: {
  target: string;
  labels: Labels;
}) {
  const targetDate = new Date(target);
  const [time, setTime] = useState(() => getDiff(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTime(getDiff(targetDate)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  if (!time) {
    return (
      <p className="mt-8 font-display text-[clamp(1.5rem,4vw,2.25rem)] italic">
        {labels.live}
      </p>
    );
  }

  const items: Array<[number, string]> = [
    [time.days, labels.days],
    [time.hours, labels.hours],
    [time.minutes, labels.minutes],
    [time.seconds, labels.seconds],
  ];

  return (
    <div className="mt-8 flex justify-center gap-4 md:gap-8">
      {items.map(([value, label]) => (
        <div key={label} className="flex w-16 flex-col items-center md:w-24">
          <span
            suppressHydrationWarning
            className="font-display text-[clamp(2rem,6vw,3.5rem)] leading-none tabular-nums [font-variant-numeric:tabular-nums]"
          >
            {value.toString().padStart(2, "0")}
          </span>
          <span className="mt-2 text-[0.6rem] uppercase tracking-[0.28em] text-muted-foreground md:text-[0.7rem]">
            {label}
          </span>
        </div>
      ))}
    </div>
  );

}
