import { createServerFn } from "@tanstack/react-start";
import webpush from "web-push";
import nodemailer from "nodemailer";
import { db } from "./db";

export type Notification = {
  id: number;
  title: string;
  body: string;
  created_at: string;
};

export const getNotifications = createServerFn({ method: "GET" }).handler(async () => {
  const notifications = db
    .query("SELECT id, title, body, created_at FROM notifications ORDER BY created_at DESC")
    .all() as Notification[];
  return {
    notifications,
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY ?? null,
  };
});

export const subscribePush = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (typeof data !== "object" || data === null) throw new Error("Invalid");
    const d = data as Record<string, unknown>;
    const sub = d.subscription as Record<string, unknown> | undefined;
    if (!sub || typeof sub.endpoint !== "string") throw new Error("Invalid subscription");
    const keys = sub.keys as Record<string, string> | undefined;
    if (!keys?.auth || !keys?.p256dh) throw new Error("Missing subscription keys");
    return { endpoint: sub.endpoint, auth: keys.auth, p256dh: keys.p256dh };
  })
  .handler(async ({ data }) => {
    db.run(
      `INSERT OR REPLACE INTO push_subscriptions (endpoint, auth, p256dh) VALUES (?, ?, ?)`,
      [data.endpoint, data.auth, data.p256dh],
    );
    return { ok: true as const };
  });

export const createNotification = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (typeof data !== "object" || data === null) throw new Error("Invalid");
    const d = data as Record<string, unknown>;
    return {
      title: String(d.title ?? "").trim(),
      body: String(d.body ?? "").trim(),
      password: String(d.password ?? ""),
    };
  })
  .handler(async ({ data }) => {
    if (!process.env.ADMIN_PASSWORD || data.password !== process.env.ADMIN_PASSWORD) {
      throw new Error("Unauthorized");
    }
    if (!data.title) throw new Error("Title is required");
    if (!data.body) throw new Error("Message is required");

    db.run(`INSERT INTO notifications (title, body) VALUES (?, ?)`, [data.title, data.body]);

    await sendWebPushes(data.title, data.body);
    await sendEmails(data.title, data.body);

    return { ok: true as const };
  });

async function sendWebPushes(title: string, body: string) {
  const pubKey = process.env.VAPID_PUBLIC_KEY;
  const privKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:noreply@gnwedding2026.com";
  if (!pubKey || !privKey) return;

  webpush.setVapidDetails(subject, pubKey, privKey);
  const subs = db
    .query("SELECT endpoint, auth, p256dh FROM push_subscriptions")
    .all() as { endpoint: string; auth: string; p256dh: string }[];

  const expired: string[] = [];
  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { auth: sub.auth, p256dh: sub.p256dh } },
          JSON.stringify({ title, body }),
        );
      } catch (err: any) {
        if (err?.statusCode === 410 || err?.statusCode === 404) {
          expired.push(sub.endpoint);
        }
      }
    }),
  );
  for (const ep of expired) {
    db.run("DELETE FROM push_subscriptions WHERE endpoint = ?", [ep]);
  }
}

async function sendEmails(title: string, body: string) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpUser || !smtpPass) return;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const guests = db
    .query(
      "SELECT DISTINCT email FROM rsvps WHERE attending = 1 AND email IS NOT NULL AND email != ''",
    )
    .all() as { email: string }[];

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fdf8f0;">
      <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#b5930a;margin:0 0 24px;">Gwendolyn &amp; Noah · October 25, 2026</p>
      <h1 style="font-size:22px;color:#6b1a2b;margin:0 0 16px;">${title}</h1>
      <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 28px;">${body}</p>
      <a href="https://gnwedding2026.com" style="display:inline-block;padding:11px 28px;background:#6b1a2b;color:#fff;text-decoration:none;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;border-radius:100px;">Visit Our Site</a>
    </div>
  `;

  await Promise.allSettled(
    guests.map((g) =>
      transporter.sendMail({
        from: `"Gwendolyn & Noah" <${smtpUser}>`,
        to: g.email,
        subject: title,
        html,
      }),
    ),
  );
}
