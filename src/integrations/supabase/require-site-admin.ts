import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { supabaseAdmin } from "./client.server";

type JwtClaims = {
  sub?: string;
  email?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

function emailAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? process.env.SITE_ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function hasAdminRoleClaim(claims: JwtClaims): boolean {
  const appRole = claims.app_metadata?.role;
  const userRole = claims.user_metadata?.role;
  return appRole === "admin" || userRole === "admin";
}

async function isListedSiteAdmin(
  userId: string,
): Promise<"yes" | "no" | "unknown"> {
  const { data, error } = await supabaseAdmin
    .from("site_admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    // Migration not applied yet — keep legacy "any authenticated" behavior.
    const missing =
      error.code === "42P01" ||
      error.code === "PGRST205" ||
      /does not exist|could not find the table/i.test(error.message);
    if (missing) {
      console.warn(
        "[auth] site_admins missing; apply supabase migration 20260820100000_site_admin_rls",
      );
      return "unknown";
    }
    console.error("[auth] site_admins lookup failed", error.message);
    return "no";
  }
  return data?.user_id ? "yes" : "no";
}

/**
 * Requires a valid Supabase session AND site-admin authorization
 * (JWT role, ADMIN_EMAILS allowlist, or site_admins row).
 */
export const requireSiteAdmin = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      const missing = [
        ...(!SUPABASE_URL ? ["SUPABASE_URL"] : []),
        ...(!SUPABASE_PUBLISHABLE_KEY ? ["SUPABASE_PUBLISHABLE_KEY"] : []),
      ];
      throw new Error(
        `Missing Supabase environment variable(s): ${missing.join(", ")}. Connect Supabase in Lovable Cloud.`,
      );
    }

    const request = getRequest();
    if (!request?.headers) {
      throw new Error("Unauthorized: No request headers available");
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      throw new Error("Unauthorized: No authorization header provided");
    }
    if (!authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized: Only Bearer tokens are supported");
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }

    const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: {
        storage: undefined,
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase.auth.getClaims(token);
    if (error || !data?.claims) {
      throw new Error("Unauthorized: Invalid token");
    }

    const claims = data.claims as JwtClaims;
    if (!claims.sub) {
      throw new Error("Unauthorized: No user ID found in token");
    }

    const email = typeof claims.email === "string" ? claims.email.toLowerCase() : "";
    const allowlisted = email.length > 0 && emailAllowlist().includes(email);
    const roleAdmin = hasAdminRoleClaim(claims);
    const tableAdmin = await isListedSiteAdmin(claims.sub);

    const allowed =
      roleAdmin ||
      allowlisted ||
      tableAdmin === "yes" ||
      // Pre-migration: preserve access for existing authenticated operators
      tableAdmin === "unknown";

    if (!allowed) {
      throw new Error("Forbidden: site admin access required");
    }

    return next({
      context: {
        supabase,
        userId: claims.sub,
        claims,
        isSiteAdmin: true,
      },
    });
  },
);
