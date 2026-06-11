import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getPopupSettings,
  savePopupSettings,
} from "@/lib/popup/popup.functions";
import type { PopupStatus, SitePopupSettings } from "@/lib/popup/types";

export const Route = createFileRoute("/admin/popup")({
  component: PopupAdmin,
});

type FormState = {
  popup_status: PopupStatus;
  venue: string;
  date_label: string;
  date_label_en: string;
  date_short: string;
  date_short_en: string;
  time_label: string;
  address_short: string;
  address_full: string;
  maps_google: string;
  maps_apple: string;
  countdown_target: string;
};

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(v: string): string | null {
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function settingsToForm(s: SitePopupSettings): FormState {
  return {
    popup_status: s.popup_status,
    venue: s.venue ?? "",
    date_label: s.date_label ?? "",
    date_label_en: s.date_label_en ?? "",
    date_short: s.date_short ?? "",
    date_short_en: s.date_short_en ?? "",
    time_label: s.time_label ?? "",
    address_short: s.address_short ?? "",
    address_full: s.address_full ?? "",
    maps_google: s.maps_google ?? "",
    maps_apple: s.maps_apple ?? "",
    countdown_target: toLocalInput(s.countdown_target),
  };
}

function PopupAdmin() {
  const fetchSettings = useServerFn(getPopupSettings);
  const saveSettings = useServerFn(savePopupSettings);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings().then((s) => setForm(settingsToForm(s)));
  }, [fetchSettings]);

  if (!form) {
    return <p className="text-sm text-muted-foreground">Laster …</p>;
  }

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setErr(null);
    setMsg(null);

    if (form.popup_status === "announced") {
      if (!form.venue.trim() || !form.date_label.trim()) {
        setErr("Når status er «Annonsert», må både sted og dato fylles ut.");
        return;
      }
    }

    setSaving(true);
    try {
      await saveSettings({
        data: {
          popup_status: form.popup_status,
          venue: form.venue.trim() || null,
          date_label: form.date_label.trim() || null,
          date_label_en: form.date_label_en.trim() || null,
          date_short: form.date_short.trim() || null,
          date_short_en: form.date_short_en.trim() || null,
          time_label: form.time_label.trim() || null,
          address_short: form.address_short.trim() || null,
          address_full: form.address_full.trim() || null,
          maps_google: form.maps_google.trim() || null,
          maps_apple: form.maps_apple.trim() || null,
          countdown_target: fromLocalInput(form.countdown_target),
        },
      });
      setMsg("Lagret.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Kunne ikke lagre.");
    } finally {
      setSaving(false);
    }
  }

  const announced = form.popup_status === "announced";

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin" className="text-xs text-muted-foreground hover:underline">
          ← Tilbake
        </Link>
        <h1 className="mt-2 font-display text-3xl tracking-tight">Popup-innstillinger</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Styrer «Neste popup»-seksjonen på forsiden.
        </p>
      </div>

      <form onSubmit={onSubmit} className="grid max-w-2xl gap-5">
        <div className="flex flex-col gap-1.5">
          <Label>Status</Label>
          <Select
            value={form.popup_status}
            onValueChange={(v) => set("popup_status", v as PopupStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="coming_soon">Kommer snart (venteliste)</SelectItem>
              <SelectItem value="announced">Annonsert (vis detaljer)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {announced ? (
          <>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="venue">Sted (venue)</Label>
              <Input
                id="venue"
                value={form.venue}
                onChange={(e) => set("venue", e.target.value)}
                placeholder="Klink Vulkan"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="date_label">Dato (NO, lang)</Label>
                <Input
                  id="date_label"
                  value={form.date_label}
                  onChange={(e) => set("date_label", e.target.value)}
                  placeholder="Tirsdag 9. juni 2026"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="date_label_en">Dato (EN, lang)</Label>
                <Input
                  id="date_label_en"
                  value={form.date_label_en}
                  onChange={(e) => set("date_label_en", e.target.value)}
                  placeholder="Tuesday June 9, 2026"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="date_short">Dato (NO, kort)</Label>
                <Input
                  id="date_short"
                  value={form.date_short}
                  onChange={(e) => set("date_short", e.target.value)}
                  placeholder="Tirsdag 9. juni"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="date_short_en">Dato (EN, kort)</Label>
                <Input
                  id="date_short_en"
                  value={form.date_short_en}
                  onChange={(e) => set("date_short_en", e.target.value)}
                  placeholder="Tuesday June 9"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="time_label">Tid</Label>
              <Input
                id="time_label"
                value={form.time_label}
                onChange={(e) => set("time_label", e.target.value)}
                placeholder="12–17"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="address_short">Adresse (kort)</Label>
                <Input
                  id="address_short"
                  value={form.address_short}
                  onChange={(e) => set("address_short", e.target.value)}
                  placeholder="Klink Vulkan · Vulkan 9"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="address_full">Adresse (full)</Label>
                <Input
                  id="address_full"
                  value={form.address_full}
                  onChange={(e) => set("address_full", e.target.value)}
                  placeholder="Klink Vulkan, Vulkan 9, Oslo"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="maps_google">Google Maps URL</Label>
                <Input
                  id="maps_google"
                  value={form.maps_google}
                  onChange={(e) => set("maps_google", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="maps_apple">Apple Maps URL (valgfritt)</Label>
                <Input
                  id="maps_apple"
                  value={form.maps_apple}
                  onChange={(e) => set("maps_apple", e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="countdown_target">Countdown-tidspunkt</Label>
              <Input
                id="countdown_target"
                type="datetime-local"
                value={form.countdown_target}
                onChange={(e) => set("countdown_target", e.target.value)}
              />
            </div>
          </>
        ) : (
          <p className="rounded-md border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
            Forsiden viser «Neste popup kommer snart» og prioriterer venteliste.
            Bytt til «Annonsert» når dato og sted er klart.
          </p>
        )}

        {err ? <p className="text-sm text-[color:var(--tomato)]">{err}</p> : null}
        {msg ? <p className="text-sm text-foreground/70">{msg}</p> : null}

        <div>
          <Button type="submit" disabled={saving}>
            {saving ? "Lagrer …" : "Lagre"}
          </Button>
        </div>
      </form>
    </div>
  );
}
