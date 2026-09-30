import { Resend } from "resend";
import { contactSchema, CONTACT_ERROR } from "@/lib/contact-schema";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(ip)) return Response.json({ error: "Too many messages from this connection. Try again in a few minutes, or use WhatsApp." }, { status: 429 });

  const json = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) return Response.json({ error: CONTACT_ERROR }, { status: 400 });

  const { name, email, subject, message, website } = parsed.data;
  if (website) return Response.json({ ok: true }); // bot filled the honeypot; pretend it worked
  if (process.env.CONTACT_DRY_RUN === "1") return Response.json({ ok: true });

  const to = process.env.CONTACT_TO;
  if (!to || !process.env.RESEND_API_KEY) {
    console.error("[contact] CONTACT_TO or RESEND_API_KEY is not set; message dropped");
    return Response.json({ error: "Contact form is not configured. Email me directly." }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>", // ponytail: sandbox sender until a domain is verified in Resend
    to: [to],
    replyTo: email,
    subject: `[Portfolio] ${subject} — ${name}`,
    text: `${message}\n\n— ${name} <${email}>\nSubject: ${subject}\nIP: ${ip}`,
  });
  if (error) {
    console.error("[contact] Resend send failed", error);
    return Response.json({ error: "Couldn't send right now. Email me directly or use WhatsApp." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
