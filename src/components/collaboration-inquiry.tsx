import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  submitCollaborationInquiry,
  EVENT_TYPES,
  type EventType,
} from "@/lib/inquiries/inquiries.functions";

type Lang = "no" | "en";

const COPY = {
  no: {
    eyebrow: "Eventer & samarbeid",
    title: "Ønsker du arancini til ditt arrangement?",
    body: "Bryllup, firmafest, festival eller noe helt annet. Ta kontakt, så ser vi om Gold of Sicily passer for ditt arrangement.",
    name: "Navn",
    email: "E-post",
    eventType: "Type arrangement",
    eventTypePlaceholder: "Velg type",
    guestCount: "Antall gjester (ca.)",
    guestCountPlaceholder: "f.eks. 80",
    message: "Fortell kort om arrangementet",
    submit: "Send forespørsel",
    submitting: "Sender …",
    success: "Takk for henvendelsen. Vi tar kontakt så snart vi kan.",
    error: "Noe gikk galt. Prøv igjen.",
    eventLabels: {
      bryllup: "Bryllup",
      firmaevent: "Firmaevent",
      festival: "Festival",
      bursdag: "Bursdag",
      popup_samarbeid: "Popup-samarbeid",
      annet: "Annet",
    } satisfies Record<EventType, string>,
  },
  en: {
    eyebrow: "Events & partnerships",
    title: "Want arancini at your event?",
    body: "Wedding, company event, festival or something else. Get in touch and we'll see if Gold of Sicily fits your event.",
    name: "Name",
    email: "Email",
    eventType: "Event type",
    eventTypePlaceholder: "Choose type",
    guestCount: "Approx. guest count",
    guestCountPlaceholder: "e.g. 80",
    message: "Tell us briefly about the event",
    submit: "Send inquiry",
    submitting: "Sending …",
    success: "Thanks for reaching out. We'll get back to you as soon as we can.",
    error: "Something went wrong. Try again.",
    eventLabels: {
      bryllup: "Wedding",
      firmaevent: "Company event",
      festival: "Festival",
      bursdag: "Birthday",
      popup_samarbeid: "Popup partnership",
      annet: "Other",
    } satisfies Record<EventType, string>,
  },
} as const;

export function CollaborationInquiry({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const submit = useServerFn(submitCollaborationInquiry);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState<EventType | "">("");
  const [guestCount, setGuestCount] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!eventType) return;
    setState("sending");
    setErrorMsg(null);
    try {
      await submit({
        data: {
          name: name.trim(),
          email: email.trim(),
          event_type: eventType,
          guest_count: guestCount.trim() || null,
          message: message.trim(),
          lang,
        },
      });
      setState("ok");
      setName("");
      setEmail("");
      setEventType("");
      setGuestCount("");
      setMessage("");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : t.error);
    }
  }

  return (
    <section
      id="samarbeid"
      className="border-t border-foreground/15 bg-background px-6 py-16 md:py-24"
    >
      <div className="mx-auto max-w-lg">
        <div className="text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="mt-5 font-display text-[clamp(1.75rem,5vw,2.5rem)] italic leading-[1.1] tracking-tight">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[0.95rem] leading-relaxed text-foreground/70">
            {t.body}
          </p>
        </div>

        {state === "ok" ? (
          <div className="mt-8 rounded-sm border-2 border-foreground bg-[color:var(--blush)] px-5 py-4 text-center text-sm text-foreground shadow-[3px_3px_0_0_var(--color-foreground)]">
            {t.success}
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ci-name">{t.name}</Label>
              <Input
                id="ci-name"
                required
                maxLength={120}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ci-email">{t.email}</Label>
              <Input
                id="ci-email"
                type="email"
                required
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ci-type">{t.eventType}</Label>
              <Select
                value={eventType}
                onValueChange={(v) => setEventType(v as EventType)}
              >
                <SelectTrigger id="ci-type">
                  <SelectValue placeholder={t.eventTypePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((et) => (
                    <SelectItem key={et} value={et}>
                      {t.eventLabels[et]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ci-guests">{t.guestCount}</Label>
              <Input
                id="ci-guests"
                maxLength={50}
                placeholder={t.guestCountPlaceholder}
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ci-msg">{t.message}</Label>
              <Textarea
                id="ci-msg"
                required
                rows={4}
                maxLength={2000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            {state === "error" && errorMsg ? (
              <p className="text-sm text-[color:var(--tomato)]">{errorMsg}</p>
            ) : null}
            <Button
              type="submit"
              disabled={state === "sending" || !eventType}
              className="mt-2"
            >
              {state === "sending" ? t.submitting : t.submit}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
