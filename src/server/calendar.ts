import { createServerFn } from "@tanstack/react-start";

const ICS_URL =
  "https://calendar.google.com/calendar/ical/8c9da5b0ab48578ed31aaa66f7584b368339ac73e165e58c9d1f7c01fe05c26c%40group.calendar.google.com/public/basic.ics";

const TZ = "America/New_York";
const CACHE_TTL_MS = 5 * 60 * 1000;
const FETCH_TIMEOUT_MS = 5000;

export type CalendarEvent = {
  id: string;
  summary: string;
  location?: string;
  description?: string;
  allDay: boolean;
  /** wall-clock ISO-ish in America/New_York: "2026-10-25T15:30" (or "2026-10-25" for all-day) */
  start: string;
  end: string;
};

let cache: { at: number; events: CalendarEvent[] } | null = null;

async function fetchEvents(): Promise<CalendarEvent[]> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.events;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(ICS_URL, { signal: controller.signal });
    if (!res.ok) throw new Error(`ICS fetch failed: ${res.status}`);
    const text = await res.text();
    const events = parseIcs(text);
    cache = { at: Date.now(), events };
    return events;
  } finally {
    clearTimeout(timer);
  }
}

export const getEvents = createServerFn({ method: "GET" }).handler(
  async (): Promise<CalendarEvent[]> => {
    try {
      return await fetchEvents();
    } catch (err) {
      console.error("[calendar] fetch failed", err);
      return [];
    }
  },
);

// ---------- ICS parsing ----------

function parseIcs(text: string): CalendarEvent[] {
  // 1. Unfold continuation lines (lines starting with space/tab continue the previous one).
  const unfolded: string[] = [];
  for (const raw of text.split(/\r?\n/)) {
    if (raw.length === 0) continue;
    if ((raw[0] === " " || raw[0] === "\t") && unfolded.length > 0) {
      unfolded[unfolded.length - 1] += raw.slice(1);
    } else {
      unfolded.push(raw);
    }
  }

  const events: CalendarEvent[] = [];
  let cur:
    | (Partial<CalendarEvent> & { _haveStart?: boolean; _haveEnd?: boolean })
    | null = null;

  for (const line of unfolded) {
    if (line === "BEGIN:VEVENT") {
      cur = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (cur && cur.summary && cur.start && cur.end) {
        events.push({
          id: cur.id ?? `${cur.start}-${cur.summary}`,
          summary: cur.summary,
          location: cur.location,
          description: cur.description,
          allDay: cur.allDay ?? false,
          start: cur.start,
          end: cur.end,
        });
      }
      cur = null;
      continue;
    }
    if (!cur) continue;

    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const head = line.slice(0, colonIdx);
    const value = line.slice(colonIdx + 1);
    const [name, ...paramParts] = head.split(";");
    const params: Record<string, string> = {};
    for (const p of paramParts) {
      const eq = p.indexOf("=");
      if (eq === -1) params[p] = "";
      else params[p.slice(0, eq)] = p.slice(eq + 1);
    }

    switch (name) {
      case "UID":
        cur.id = value;
        break;
      case "SUMMARY":
        cur.summary = unescape(value);
        break;
      case "LOCATION":
        cur.location = unescape(value);
        break;
      case "DESCRIPTION":
        cur.description = unescape(value);
        break;
      case "DTSTART": {
        const { wall, allDay } = parseIcsDate(value, params);
        cur.start = wall;
        if (allDay) cur.allDay = true;
        break;
      }
      case "DTEND": {
        const { wall } = parseIcsDate(value, params);
        cur.end = wall;
        break;
      }
    }
  }

  return events.sort((a, b) => a.start.localeCompare(b.start));
}

function parseIcsDate(
  v: string,
  params: Record<string, string>,
): { wall: string; allDay: boolean } {
  // DATE-only (all-day): "YYYYMMDD"
  if (params.VALUE === "DATE" || v.length === 8) {
    const y = v.slice(0, 4);
    const mo = v.slice(4, 6);
    const d = v.slice(6, 8);
    return { wall: `${y}-${mo}-${d}`, allDay: true };
  }

  // UTC datetime: "YYYYMMDDTHHMMSSZ" — convert to wall-clock in TZ
  if (v.endsWith("Z")) {
    const y = Number(v.slice(0, 4));
    const mo = Number(v.slice(4, 6));
    const d = Number(v.slice(6, 8));
    const h = Number(v.slice(9, 11));
    const mi = Number(v.slice(11, 13));
    const utcMs = Date.UTC(y, mo - 1, d, h, mi);
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const parts: Record<string, string> = {};
    for (const p of fmt.formatToParts(new Date(utcMs))) parts[p.type] = p.value;
    // hour: '2-digit' + hour12: false yields "00".."24" — coerce "24" to "00"
    const hh = parts.hour === "24" ? "00" : parts.hour;
    return {
      wall: `${parts.year}-${parts.month}-${parts.day}T${hh}:${parts.minute}`,
      allDay: false,
    };
  }

  // Floating or TZID-prefixed: "YYYYMMDDTHHMMSS" — already wall-clock
  const y = v.slice(0, 4);
  const mo = v.slice(4, 6);
  const d = v.slice(6, 8);
  const h = v.slice(9, 11);
  const mi = v.slice(11, 13);
  return { wall: `${y}-${mo}-${d}T${h}:${mi}`, allDay: false };
}

function unescape(s: string): string {
  return s
    .replace(/\\n/g, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}
