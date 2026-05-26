import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Copy = {
  label: string;
  placeholder: string;
  cta: string;
  success: string;
  exists: string;
  error: string;
  invalid: string;
};

export function NewsletterSignup({
  lang = "no",
  copy,
}: {
  lang?: "no" | "en";
  copy: Copy;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) || trimmed.length > 255) {
      setStatus("error");
      setMessage(copy.invalid);
      return;
    }
    setStatus("loading");
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: trimmed, lang });
    if (error) {
      if (error.code === "23505") {
        setStatus("done");
        setMessage(copy.exists);
      } else {
        setStatus("error");
        setMessage(copy.error);
      }
      return;
    }
    setStatus("done");
    setMessage(copy.success);
    setEmail("");
  }

  if (status === "done") {
    return (
      <p className="text-[0.7rem] uppercase tracking-[0.22em] text-foreground/80">
        ✓ {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <label className="mb-2 block text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">
        {copy.label}
      </label>
      <div className="flex items-center gap-2 border-b border-foreground/40 pb-1 focus-within:border-foreground transition-colors">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={copy.placeholder}
          className="flex-1 bg-transparent text-base md:text-sm placeholder:text-foreground/40 focus:outline-none"
          style={{ fontSize: "16px" }}
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-foreground transition hover:opacity-60 disabled:opacity-40"
        >
          {status === "loading" ? "…" : copy.cta} →
        </button>
      </div>
      {status === "error" && message ? (
        <p className="mt-2 text-[0.65rem] tracking-wide text-destructive">{message}</p>
      ) : null}
    </form>
  );
}
