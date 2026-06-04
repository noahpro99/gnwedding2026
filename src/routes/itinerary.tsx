import { createFileRoute } from "@tanstack/react-router";
import { Calendar, ChevronDown, ExternalLink, MapPin } from "lucide-react";
import { useState } from "react";
import { siApple, siGooglecalendar } from "simple-icons";
import { SectionHeader } from "~/components/SectionHeader";
import { type CalendarEvent, getEvents } from "~/server/calendar";

export const Route = createFileRoute("/itinerary")({
  loader: async () => {
    try {
      return { events: await getEvents() };
    } catch {
      return { events: [] as CalendarEvent[] };
    }
  },
  component: Itinerary,
});

const GOOGLE_CAL_VIEW_URL =
  "https://calendar.google.com/calendar/embed?src=8c9da5b0ab48578ed31aaa66f7584b368339ac73e165e58c9d1f7c01fe05c26c%40group.calendar.google.com&ctz=America%2FNew_York&mode=WEEK&dates=20261018/20261025";

const GOOGLE_CAL_ADD_URL =
  "https://calendar.google.com/calendar/u/0?cid=OGM5ZGE1YjBhYjQ4NTc4ZWQzMWFhYTY2Zjc1ODRiMzY4MzM5YWM3M2UxNjVlNThjOWQxZjdjMDFmZTA1YzI2Y0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t";

const APPLE_CAL_URL =
  "https://calendar.google.com/calendar/ical/8c9da5b0ab48578ed31aaa66f7584b368339ac73e165e58c9d1f7c01fe05c26c%40group.calendar.google.com/public/basic.ics";

function Itinerary() {
  const { events = [] } = Route.useLoaderData() ?? {};
  const filtered = removeOverlaps(events);
  const days = groupByDay(filtered);

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <SectionHeader eyebrow="The Weekend" title="Itinerary" icon={Calendar} />

      <div className="flex flex-wrap justify-center gap-3 mt-10 mb-4">
        <PillButton href={GOOGLE_CAL_ADD_URL} icon={siGooglecalendar}>
          Add to Google Calendar
        </PillButton>
        <PillButton href={APPLE_CAL_URL} icon={siApple}>
          Add to Apple Calendar
        </PillButton>
        <PillButton
          href={GOOGLE_CAL_VIEW_URL}
          variant="outline"
          lucide={ExternalLink}
        >
          Detailed view in Google Calendar
        </PillButton>
      </div>

      <p className="text-center text-xs text-ink/50 uppercase tracking-widest mb-10">
        Pulled live from our calendar. Updates reflect automatically.
      </p>

      {days.length === 0 ? (
        <div className="bg-parchment border border-amber rounded-2xl p-10 text-center">
          <p className="font-script text-3xl text-burgundy mb-2">
            Coming together
          </p>
          <p className="text-ink/70">
            We're still putting the schedule together. Check back soon, or open
            the calendar with one of the buttons above.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {days.map((day) => (
            <DayBlock key={day.dateKey} day={day} />
          ))}
        </div>
      )}
    </section>
  );
}

function DayBlock({ day }: { day: Day }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px flex-1 bg-linear-to-l from-amber/60 to-transparent" />
        <h2 className="font-script text-3xl text-burgundy">{day.label}</h2>
        <span className="h-px flex-1 bg-linear-to-r from-amber/60 to-transparent" />
      </div>

      <ul className="space-y-3">
        {day.events.map((e) => (
          <EventRow key={e.id} event={e} />
        ))}
      </ul>
    </div>
  );
}

function EventRow({ event }: { event: CalendarEvent }) {
  const [expanded, setExpanded] = useState(false);
  const time = event.allDay
    ? "All day"
    : formatTimeRange(event.start, event.end);
  const hasDetails = !!event.description;

  return (
    <li className="bg-parchment border border-amber rounded-2xl shadow-card overflow-hidden">
      <button
        type="button"
        className="w-full text-left p-5"
        onClick={() => hasDetails && setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-5">
          <div className="text-[13px] uppercase tracking-[0.2em] text-gold font-mono whitespace-nowrap sm:w-44 sm:shrink-0 mb-1 sm:mb-0 sm:pt-1">
            {time}
          </div>
          <div className="flex flex-1 items-start justify-between gap-3 min-w-0">
            <div className="min-w-0">
              <h3 className="font-script text-2xl text-burgundy leading-tight">
                {event.summary}
              </h3>
              {event.location && (
                <p className="text-sm text-ink/65 mt-1 inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                  <span className="leading-snug">{event.location}</span>
                </p>
              )}
            </div>
            {hasDetails && (
              <ChevronDown
                className={`w-4 h-4 shrink-0 text-amber mt-1.5 transition-transform ${expanded ? "rotate-180" : ""}`}
                strokeWidth={2}
              />
            )}
          </div>
        </div>
      </button>

      {expanded && event.description && (
        <div className="px-5 pb-5 pt-0 border-t border-amber/40">
          <p className="text-sm text-ink/70 mt-3 whitespace-pre-line leading-relaxed">
            {event.description}
          </p>
        </div>
      )}
    </li>
  );
}

// ---------- Buttons ----------

type LucideIconLike = (props: {
  className?: string;
  strokeWidth?: number;
}) => React.ReactNode;

function PillButton({
  href,
  icon,
  lucide: Lucide,
  variant = "filled",
  children,
}: {
  href: string;
  icon?: { path: string };
  lucide?: LucideIconLike;
  variant?: "filled" | "outline";
  children: React.ReactNode;
}) {
  const base =
    "inline-flex items-center gap-2.5 px-6 py-2.5 uppercase tracking-widest text-xs rounded-full transition-colors";
  const variantClass =
    variant === "filled"
      ? "bg-burgundy text-cream hover:bg-pumpkin"
      : "border border-burgundy text-burgundy hover:bg-burgundy hover:text-cream";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${variantClass}`}
    >
      {icon && (
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 fill-current"
          aria-hidden="true"
        >
          <path d={icon.path} />
        </svg>
      )}
      {Lucide && <Lucide className="w-4 h-4" strokeWidth={2} />}
      <span>{children}</span>
    </a>
  );
}

// ---------- Overlap filtering ----------

function eventDurationMs(e: CalendarEvent): number {
  if (e.allDay) return 0;
  return new Date(e.end).getTime() - new Date(e.start).getTime();
}

function eventsOverlap(a: CalendarEvent, b: CalendarEvent): boolean {
  if (a.allDay || b.allDay) return false;
  return a.start < b.end && b.start < a.end;
}

function removeOverlaps(events: CalendarEvent[]): CalendarEvent[] {
  const sorted = [...events].sort(
    (a, b) => eventDurationMs(b) - eventDurationMs(a),
  );
  const kept: CalendarEvent[] = [];
  for (const e of sorted) {
    if (!kept.some((k) => eventsOverlap(k, e))) {
      kept.push(e);
    }
  }
  return kept.sort((a, b) => a.start.localeCompare(b.start));
}

// ---------- Grouping & formatting ----------

type Day = {
  dateKey: string;
  label: string;
  events: CalendarEvent[];
};

function groupByDay(events: CalendarEvent[]): Day[] {
  const map = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const dateKey = e.start.slice(0, 10);
    const arr = map.get(dateKey) ?? [];
    arr.push(e);
    map.set(dateKey, arr);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, evs]) => ({
      dateKey,
      label: formatDayLabel(dateKey),
      events: evs,
    }));
}

const dayFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatDayLabel(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return dayFormat.format(new Date(Date.UTC(y!, m! - 1, d!, 12)));
}

function formatTimeRange(start: string, end: string): string {
  const s = formatTime(start);
  const e = formatTime(end);
  return s === e ? s : `${s} to ${e}`;
}

function formatTime(wall: string): string {
  const t = wall.split("T")[1];
  if (!t) return "";
  let h = Number(t.slice(0, 2));
  const mi = t.slice(3, 5);
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return mi === "00" ? `${h} ${period}` : `${h}:${mi} ${period}`;
}
