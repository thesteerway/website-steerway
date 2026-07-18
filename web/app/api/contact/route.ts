import { NextRequest, NextResponse } from "next/server";

/**
 * Contact endpoint: validates the brief, applies abuse controls, and relays
 * it to the studio inbox via Resend (https://resend.com).
 *
 * Env:
 *   RESEND_API_KEY  required in production; without it the endpoint returns
 *                   503 and the form falls back to composing a mailto.
 *   CONTACT_TO      destination inbox   (default build@thesteerway.com)
 *   CONTACT_FROM    verified sender     (default The Steerway <briefs@thesteerway.com>)
 *
 * Abuse controls:
 *   - honeypot field ("website"): bots that fill it get a fake 200
 *   - per-IP sliding-window rate limit (5 requests / hour)
 *   - strict field length caps and shape validation
 *   - text-only email body (nothing the sender writes is rendered as HTML)
 */

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  // keep the map from growing unbounded on long-lived instances
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (limited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // honeypot: humans never see this field; bots that fill it get a quiet yes
  if (str(body.website, 100)) {
    return NextResponse.json({ ok: true });
  }

  const name = str(body.name, 200);
  const email = str(body.email, 320);
  const company = str(body.company, 200);
  const need = str(body.need, 200);
  const timeline = str(body.timeline, 100);
  const budget = str(body.budget, 100);
  const brief = str(body.brief, 5000);

  if (!name || !brief || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Name, a valid email and the brief are required." },
      { status: 400 }
    );
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // not configured (e.g. local dev): tell the client to use its fallback
    return NextResponse.json(
      { ok: false, fallback: true, error: "Mail relay not configured." },
      { status: 503 }
    );
  }

  const to = process.env.CONTACT_TO || "build@thesteerway.com";
  const from =
    process.env.CONTACT_FROM || "The Steerway <briefs@thesteerway.com>";

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    company && `Company: ${company}`,
    need && `Need: ${need}`,
    timeline && `Timeline: ${timeline}`,
    budget && `Budget: ${budget}`,
    "",
    "The brief:",
    brief,
    "",
    `— sent from thesteerway.com/contact (ip ${ip})`,
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Project brief from ${name}${company ? ` (${company})` : ""}`,
      text,
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, fallback: true, error: "Mail relay failed." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
