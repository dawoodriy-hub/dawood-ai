import nodemailer from "nodemailer";

function getTransport() {
  const host = process.env.SMTP_HOST;
  if (host) {
    return nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    });
  }
  return nodemailer.createTransport({ jsonTransport: true });
}

export async function sendVerificationEmail({ to, code }) {
  const from = process.env.EMAIL_FROM || "noreply@dawood.ai";
  const appName = process.env.OPENROUTER_APP_NAME || "Dawood AI";
  const subject = `${appName} — Verify your email`;
  const text = `Your verification code is ${code}. It expires in 10 minutes.`;
  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; padding: 24px; background: #0f172a; color: #e2e8f0;">
      <h2 style="color: #00d4ff; margin: 0 0 16px;">${appName}</h2>
      <p>Use this code to verify your email:</p>
      <div style="font-size: 36px; letter-spacing: 12px; padding: 16px 24px; background: rgba(0,212,255,0.1); border-radius: 12px; margin: 16px 0; border: 1px solid rgba(0,212,255,0.3);">${code}</div>
      <p style="color: #94a3b8; font-size: 14px;">This code expires in 10 minutes.</p>
    </div>
  `;

  const transporter = getTransport();
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  return info;
}
