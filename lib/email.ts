import { getSettings } from "@/lib/settings";
// SMTP via EMAIL_SERVER (e.g. smtps://user:pass@host:465). Best-effort: failures are swallowed and message content is never logged.
export async function notifyAdmin(name: string, email: string, company: string | undefined, message: string) {
  const to = (await getSettings()).notifyEmail || process.env.ADMIN_NOTIFY_EMAIL;
  if (!process.env.EMAIL_SERVER || !process.env.EMAIL_FROM || !to) return;
  try { const nm = (await import("nodemailer")).default; const clean = (x: string) => x.replace(/[\r\n]+/g, " ").slice(0, 80);
    await nm.createTransport(process.env.EMAIL_SERVER).sendMail({ from: process.env.EMAIL_FROM, to, replyTo: email, subject: `New VYOMA ROUTE contact: ${clean(name)}`, text: `From: ${clean(name)} <${email}>${company ? `\nCompany: ${clean(company)}` : ""}\n\n${message}` });
  } catch { console.error("contact notification failed"); }
}

export async function sendAdminEmail(subject: string, text: string) {
  const to = (await getSettings()).notifyEmail || process.env.ADMIN_NOTIFY_EMAIL; if (!process.env.EMAIL_SERVER || !process.env.EMAIL_FROM || !to) return false;
  try { const nm = (await import("nodemailer")).default; await nm.createTransport(process.env.EMAIL_SERVER).sendMail({ from: process.env.EMAIL_FROM, to, subject, text }); return true; } catch { return false; }
}
