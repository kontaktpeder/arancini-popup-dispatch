import { createFileRoute, Link } from "@tanstack/react-router";
import { SLUGS, SLUG_LABELS } from "@/lib/cms/schemas";

export const Route = createFileRoute("/admin/")({
  component: AdminIndex,
});

function AdminIndex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-tight">Sider</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Velg en side for å redigere tekst og SEO.
        </p>
      </div>
      <ul className="divide-y divide-border/60 rounded-xl border border-border/60 bg-card">
        {SLUGS.map((slug) => (
          <li key={slug}>
            <Link
              to="/admin/$slug"
              params={{ slug }}
              className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-accent/50"
            >
              <div>
                <div className="font-medium">{SLUG_LABELS[slug]}</div>
                <div className="text-xs text-muted-foreground">/{slug}</div>
              </div>
              <span className="text-muted-foreground">→</span>
            </Link>
          </li>
        ))}
        <li>
          <Link
            to="/admin/popup"
            className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-accent/50"
          >
            <div>
              <div className="font-medium">Popup-innstillinger</div>
              <div className="text-xs text-muted-foreground">styrer «Neste popup» på forsiden</div>
            </div>
            <span className="text-muted-foreground">→</span>
          </Link>
        </li>
        <li>
          <Link
            to="/admin/inquiries"
            className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-accent/50"
          >
            <div>
              <div className="font-medium">Samarbeidsforespørsler</div>
              <div className="text-xs text-muted-foreground">eventer, bryllup, firma</div>
            </div>
            <span className="text-muted-foreground">→</span>
          </Link>
        </li>
        <li>
          <Link
            to="/admin/newsletter"
            className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-accent/50"
          >
            <div>
              <div className="font-medium">Nyhetsbrev</div>
              <div className="text-xs text-muted-foreground">påmeldte e-poster</div>
            </div>
            <span className="text-muted-foreground">→</span>
          </Link>
        </li>
        <li>
          <Link
            to="/admin/accounting"
            className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-accent/50"
          >
            <div>
              <div className="font-medium">Regnskap</div>
              <div className="text-xs text-muted-foreground">utgifter, inntekter, bilag</div>
            </div>
            <span className="text-muted-foreground">→</span>
          </Link>
        </li>
      </ul>


    </div>
  );
}
