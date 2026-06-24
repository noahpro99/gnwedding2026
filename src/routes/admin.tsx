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
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("admin-pw");
      if (saved) setPassword(saved);
    } catch {}
    getNotifications()
      .then((r) => setNotifications(r.notifications))
      .catch(() => {});
  }, []);

  function handlePasswordChange(pw: string) {
    setPassword(pw);
    try { sessionStorage.setItem("admin-pw", pw); } catch {}
  }

  async function submit(silent: boolean) {
    setStatus("sending");
    setError("");
    try {
      await createNotification({ data: { title, body, password, silent } });
      setTitle("");
      setBody("");
      setStatus("sent");
      const r = await getNotifications();
      setNotifications(r.notifications);
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      setStatus("error");
      setError(err?.message ?? "Failed to send");
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-2">Admin</p>
      <h1 className="font-script text-5xl text-burgundy mb-10">Send Update</h1>

      <form onSubmit={(e) => { e.preventDefault(); submit(false); }} className="flex flex-col gap-4 mb-14">
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          className="border border-amber/60 rounded-xl px-4 py-2.5 bg-parchment text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-burgundy/30"
          required
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-amber/60 rounded-xl px-4 py-2.5 bg-parchment text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-burgundy/30"
          required
        />
        <textarea
          placeholder="Message"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="border border-amber/60 rounded-xl px-4 py-2.5 bg-parchment text-ink placeholder:text-ink/40 resize-none focus:outline-none focus:ring-2 focus:ring-burgundy/30"
          required
        />
        {error && <p className="text-red-700 text-sm">{error}</p>}
        <div className="flex gap-3 flex-wrap">
          <button
            type="submit"
            disabled={status === "sending"}
            className="px-8 py-3 bg-burgundy text-cream uppercase tracking-widest text-sm rounded-full hover:bg-pumpkin transition-colors disabled:opacity-50"
          >
            {status === "sending" ? "Sending…" : status === "sent" ? "Sent!" : "Send to Everyone"}
          </button>
          <button
            type="button"
            disabled={status === "sending"}
            onClick={() => submit(true)}
            className="px-8 py-3 border border-burgundy text-burgundy uppercase tracking-widest text-sm rounded-full hover:bg-burgundy hover:text-cream transition-colors disabled:opacity-50"
          >
            {status === "sending" ? "Saving…" : status === "sent" ? "Saved!" : "Add to Page Only"}
          </button>
        </div>
      </form>

      {notifications.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-4">
            Previous Updates
          </p>
          <ul className="divide-y divide-amber/30">
            {notifications.map((n) => (
              <li key={n.id} className="py-4">
                <p className="font-medium text-burgundy">{n.title}</p>
                <p className="text-sm text-ink/70 mt-1 leading-relaxed">{n.body}</p>
                <p className="text-xs text-ink/40 mt-1.5">
                  {new Date(n.created_at + "Z").toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
