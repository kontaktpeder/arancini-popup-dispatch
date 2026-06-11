import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Inquiry = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  event_type: string;
  guest_count: string | null;
  message: string;
  lang: string;
};

const EVENT_LABELS: Record<string, string> = {
  bryllup: "Bryllup",
  firmaevent: "Firmaevent",
  festival: "Festival",
  bursdag: "Bursdag",
  popup_samarbeid: "Popup-samarbeid",
  annet: "Annet",
};

export const Route = createFileRoute("/admin/inquiries")({
  component: InquiriesAdmin,
});

function InquiriesAdmin() {
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("all");

  useEffect(() => {
    supabase
      .from("collaboration_inquiries")
      .select("id, created_at, name, email, event_type, guest_count, message, lang")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRows((data as Inquiry[] | null) ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (type !== "all" && r.event_type !== type) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.message.toLowerCase().includes(q)
      );
    });
  }, [rows, search, type]);

  function exportCsv() {
    const header = "name,email,event_type,guest_count,message,lang,created_at\n";
    const esc = (v: string | null) =>
      v == null ? "" : `"${v.replace(/"/g, '""').replace(/\n/g, " ")}"`;
    const body = filtered
      .map((r) =>
        [r.name, r.email, r.event_type, r.guest_count, r.message, r.lang, r.created_at]
          .map((v) => esc(v == null ? null : String(v)))
          .join(","),
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin" className="text-xs text-muted-foreground hover:underline">
          ← Tilbake
        </Link>
        <h1 className="mt-2 font-display text-3xl tracking-tight">
          Samarbeidsforespørsler
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {loading ? "Laster …" : `${rows.length} totalt · ${filtered.length} viste`}
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <Input
            placeholder="Søk på navn, e-post eller melding …"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle typer</SelectItem>
              {Object.entries(EVENT_LABELS).map(([v, label]) => (
                <SelectItem key={v} value={v}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="button" variant="outline" onClick={exportCsv} disabled={!filtered.length}>
          Eksporter CSV
        </Button>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {filtered.map((r) => (
          <article
            key={r.id}
            className="rounded-lg border border-border/60 bg-card p-4 text-sm"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-medium">{r.name}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(r.created_at).toLocaleDateString("no-NO")}
              </span>
            </div>
            <a href={`mailto:${r.email}`} className="text-xs text-muted-foreground underline-offset-2 hover:underline">
              {r.email}
            </a>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-muted px-2 py-0.5">
                {EVENT_LABELS[r.event_type] ?? r.event_type}
              </span>
              {r.guest_count ? (
                <span className="rounded-full bg-muted px-2 py-0.5">{r.guest_count} pers</span>
              ) : null}
              <span className="rounded-full bg-muted px-2 py-0.5 uppercase">{r.lang}</span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-foreground/80">{r.message}</p>
          </article>
        ))}
        {!loading && !filtered.length ? (
          <p className="text-sm text-muted-foreground">Ingen henvendelser.</p>
        ) : null}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-lg border border-border/60 md:block">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Dato</th>
              <th className="px-4 py-3">Navn</th>
              <th className="px-4 py-3">E-post</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Gjester</th>
              <th className="px-4 py-3">Melding</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border/40 align-top">
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleString("no-NO")}
                </td>
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3">
                  <a href={`mailto:${r.email}`} className="underline-offset-2 hover:underline">
                    {r.email}
                  </a>
                </td>
                <td className="px-4 py-3">{EVENT_LABELS[r.event_type] ?? r.event_type}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.guest_count ?? "—"}</td>
                <td className="max-w-md px-4 py-3 whitespace-pre-wrap text-foreground/80">
                  {r.message}
                </td>
              </tr>
            ))}
            {!loading && !filtered.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  Ingen henvendelser.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
