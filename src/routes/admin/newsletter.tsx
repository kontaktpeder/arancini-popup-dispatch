import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Subscriber = {
  id: string;
  email: string;
  lang: string;
  created_at: string;
};

export const Route = createFileRoute("/admin/newsletter")({
  component: NewsletterAdmin,
});

function NewsletterAdmin() {
  const [rows, setRows] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("newsletter_subscribers")
      .select("id, email, lang, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRows((data as Subscriber[] | null) ?? []);
        setLoading(false);
      });
  }, []);

  function exportCsv() {
    const header = "email,lang,created_at\n";
    const body = rows
      .map((r) => `${r.email},${r.lang},${r.created_at}`)
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Link to="/admin" className="text-xs text-muted-foreground hover:underline">
            ← Tilbake
          </Link>
          <h1 className="mt-2 font-display text-3xl tracking-tight">Nyhetsbrev</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? "Laster…" : `${rows.length} påmeldte`}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCsv} disabled={!rows.length}>
          Eksporter CSV
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
        <table className="hidden w-full text-sm sm:table">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">E-post</th>
              <th className="px-4 py-3">Språk</th>
              <th className="px-4 py-3">Påmeldt</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border/40">
                <td className="px-4 py-3 break-all">{r.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.lang}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(r.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {!loading && !rows.length ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  Ingen påmeldte ennå.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>

        <ul className="divide-y divide-border/40 sm:hidden">
          {rows.map((r) => (
            <li key={r.id} className="px-4 py-3">
              <div className="break-all text-sm font-medium">{r.email}</div>
              <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="uppercase tracking-wide">{r.lang}</span>
                <span>{new Date(r.created_at).toLocaleString()}</span>
              </div>
            </li>
          ))}
          {!loading && !rows.length ? (
            <li className="px-4 py-8 text-center text-sm text-muted-foreground">
              Ingen påmeldte ennå.
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
