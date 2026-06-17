import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getNotifications, subscribePush } from "~/server/notifications";
import type { Notification } from "~/server/notifications";

const STORAGE_KEY = "gnwedding-read-notifications";

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; i++) {
    view[i] = rawData.charCodeAt(i);
  }
  return buffer;
}

async function registerPush(vapidKey: string) {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;
    const swReg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    await navigator.serviceWorker.ready;
    const existing = await swReg.pushManager.getSubscription();
    const subscription =
      existing ??
      (await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      }));
    const json = subscription.toJSON();
    await subscribePush({
      data: {
        subscription: {
          endpoint: json.endpoint!,
          keys: { auth: json.keys!.auth, p256dh: json.keys!.p256dh },
        },
      },
    });
  } catch {
    // permission denied or push not supported
  }
}

export function NotificationBell() {
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [vapidKey, setVapidKey] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setReadIds(new Set(JSON.parse(stored)));
    } catch {}
    getNotifications()
      .then((result) => {
        setNotifications(result.notifications);
        setVapidKey(result.vapidPublicKey);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const unreadCount = mounted
    ? notifications.filter((n) => !readIds.has(String(n.id))).length
    : 0;

  function handleToggle() {
    if (!mounted) return;
    const opening = !open;
    setOpen(opening);
    if (opening) {
      const newReadIds = new Set([...readIds, ...notifications.map((n) => String(n.id))]);
      setReadIds(newReadIds);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...newReadIds]));
      } catch {}
      if (vapidKey && "Notification" in window && Notification.permission === "default") {
        registerPush(vapidKey);
      }
    }
  }

  return (
    <div ref={ref} className="relative flex items-center">
      <button
        onClick={handleToggle}
        aria-label="Updates"
        className="relative p-2 text-ink/60 hover:text-burgundy transition-colors"
      >
        <Bell className="w-5 h-5" strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-burgundy text-cream text-[10px] font-medium rounded-full flex items-center justify-center px-1 leading-none pointer-events-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {mounted && open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-cream rounded-2xl shadow-[0_8px_40px_rgba(92,58,34,0.18)] border border-amber/40 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-amber/30">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold">Updates</p>
          </div>
          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-ink/50">No updates yet</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto divide-y divide-amber/20">
              {notifications.map((n) => (
                <li key={n.id} className="px-4 py-3">
                  <p className="text-sm font-medium text-burgundy leading-snug">{n.title}</p>
                  <p className="text-xs text-ink/70 mt-0.5 leading-relaxed">{n.body}</p>
                  <p className="text-[10px] text-ink/40 mt-1.5">
                    {new Date(n.created_at + "Z").toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
