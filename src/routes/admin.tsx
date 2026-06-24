import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createNotification, getNotifications } from "~/server/notifications";
import type { Notification } from "~/server/notifications";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("admin-pw");
      if (saved) setPassword(saved);
    } catch {}
    reload();
  }, []);

  function reload() {
    getNotifications()
      .then((r) => setNotifications(r.notifications))
      .catch(() => {});
  }

  function handlePasswordChange(pw: string) {
    setPassword(pw);
    try { sessionStorage.setItem("admin-pw", pw); } catch {}
  }

  async function submit(mode: "all" | "push" | "silent") {
    if (!title.trim() || !body.trim()) return;
    setStatus("sending");
    setError("");
    try {
      await createNotification({ data: { title, body, password, mode } });
      setTitle("");
      setBody("");
      setStatus("done");
      reload();
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      setStatus("error");
      setError(err?.message ?? "Failed");
    }
  }

  const busy = status === "sending";

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-2">Admin</p>
      <h1 className="font-script text-5xl text-burgundy mb-10">Send Update</h1>

      <div className="flex flex-col gap-4 mb-14">
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          className="border border-amber/60 rounded-xl px-4 py-2.5 bg-parchment text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-burgundy/30"
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-amber/60 rounded-xl px-4 py-2.5 bg-parchment text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-burgundy/30"
        />
        <textarea
          placeholder="Message"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="border border-amber/60 rounded-xl px-4 py-2.5 bg-parchment text-ink placeholder:text-ink/40 resize-none focus:outline-none focus:ring-2 focus:ring-burgundy/30"
        />
        {error && <p className="text-red-700 text-sm">{error}</p>}
        {status === "done" && <p className="text-green-700 text-sm">Done!</p>}
        <div className="flex flex-wrap gap-3">
          <button
            disabled={busy}
            onClick={() => submit("all")}
            className="px-6 py-2.5 bg-burgundy text-cream uppercase tracking-widest text-xs rounded-full hover:bg-pumpkin transition-colors disabled:opacity-50"
          >
            {busy ? "Sending…" : "Push + Email + Page"}
          </button>
          <button
            disabled={busy}
            onClick={() => submit("push")}
            className="px-6 py-2.5 border border-burgundy text-burgundy uppercase tracking-widest text-xs rounded-full hover:bg-burgundy hover:text-cream transition-colors disabled:opacity-50"
          >
            {busy ? "Sending…" : "Push Only + Page"}
          </button>
          <button
            disabled={busy}
            onClick={() => submit("silent")}
            className="px-6 py-2.5 border border-amber/60 text-ink/60 uppercase tracking-widest text-xs rounded-full hover:bg-amber/20 transition-colors disabled:opacity-50"
          >
            {busy ? "Saving…" : "Page Only"}
          </button>
        </div>
      </div>

      {notifications.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-4">Send Log</p>
          <ul className="divide-y divide-amber/30">
            {notifications.map((n) => {
              const hasPush = n.push_sent > 0;
              const hasEmail = n.email_sent > 0;
              const deliveryLabel = n.push_sent === 0 && n.email_sent === 0
                ? "Page only"
                : [hasPush && `${n.push_sent} push`, hasEmail && `${n.email_sent} email`]
                    .filter(Boolean)
                    .join(" · ");
              return (
                <li key={n.id} className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-burgundy">{n.title}</p>
                      <p className="text-sm text-ink/70 mt-0.5 leading-relaxed">{n.body}</p>
                    </div>
                    <span className="shrink-0 text-[10px] uppercase tracking-widest text-ink/40 mt-0.5">
                      {deliveryLabel}
                    </span>
                  </div>
                  <p className="text-xs text-ink/40 mt-1.5">
                    {new Date(n.created_at + "Z").toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
