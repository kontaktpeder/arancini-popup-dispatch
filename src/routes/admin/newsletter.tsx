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

  const [copied, setCopied] = useState<"no" | "en" | null>(null);

  async function copyEmails(lang: "no" | "en") {
    const emails = rows
      .filter((r) => r.lang === lang)
      .map((r) => r.email)
      .join(", ");
    if (!emails) {
      alert(`Ingen ${lang === "no" ? "norske" : "engelske"} påmeldte ennå.`);
      return;
    }
    try {
      await navigator.clipboard.writeText(emails);
    } catch {
      // Fallback for older browsers / non-secure contexts
      const ta = document.createElement("textarea");
      ta.value = emails;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(lang);
    setTimeout(() => setCopied(null), 2000);
  }

  const countNo = rows.filter((r) => r.lang === "no").length;
  const countEn = rows.filter((r) => r.lang === "en").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link to="/admin" className="text-xs text-muted-foreground hover:underline">
            ← Tilbake
          </Link>
          <h1 className="mt-2 font-display text-3xl tracking-tight">Nyhetsbrev</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? "Laster…" : `${rows.length} påmeldte (${countNo} norsk, ${countEn} engelsk)`}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Kopier e-poster og lim rett inn i Til-feltet i Gmail.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => copyEmails("no")}>
            {copied === "no" ? "✓ Kopiert" : `Kopier norsk (${countNo})`}
          </Button>
          <Button variant="outline" size="sm" onClick={() => copyEmails("en")}>
            {copied === "en" ? "✓ Kopiert" : `Kopier engelsk (${countEn})`}
          </Button>
        </div>


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
