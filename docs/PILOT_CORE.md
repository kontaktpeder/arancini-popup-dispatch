# Pilot Core

Gold of Sicily's first **core product**: venue logging that automatically builds the weekly status required by the pilot agreement — not a new reporting duty, and not AI.

App UI follows **Work Core** and **Dagen Vår** (document lock, tap targets, nested bottom sheets). Branding is Gold of Sicily (Fraunces, Inter, blush / espresso / tomato / golden / olive).

## Surfaces

| Path | Who |
|------|-----|
| `/pilot` | Venue — four actions |
| `/pilot/leverandor` | Supplier — funnel, batches, report |
| `/admin` | Link from existing admin |

## Four actions

1. **Jeg tar ut varer fra fryseren** — variant, qty, FIFO batch, automatic timestamp and thaw deadline.
2. **Dagens status** — sold, discarded, thawed unsold, optional price override, workflow rating.
3. **Ukentlig oppsummering** — auto numbers + six contract questions.
4. **Rapporter avvik** — immediate, not via day close.

## Domain rules baked in

- Daily registration **replaces** the manual weekly report (punkt 10). Fallback: e-mail.
- Hold time after thaw is **configurable 24h / 48h** (website vs contract). Default 48h until written clarification.
- Contracted weekly qty is **100**. The app may recommend a change; it never applies it without a written agreement.
- First version is logging, calculations, and simple alerts. Four weeks / 400 units is too little for forecasting.

## Data

v0 persists in `localStorage` (`gos.pilot-core.v1`) so the venue app works without a new database. The module is structured as a core: typed domain, org id, Module Contract v1, supplier vs venue UX. Next step is a dedicated Supabase project and RLS — same pattern as Work / Control.

## Annex 4 wording

> Pilotkunden benytter leverandørens enkle pilotapp til registrering av uttak fra fryser, salg, svinn, beholdning og korte driftsobservasjoner. Registreringene danner automatisk den ukentlige statusen etter punkt 10 og erstatter separat rapportering. Dersom løsningen er utilgjengelig, kan opplysningene deles på e-post. Bruken utvider ikke pilotkundens opplysningsplikt utover avtalen.
