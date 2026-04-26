import sgMail from "@sendgrid/mail";

const TIME_ZONE = "Australia/Sydney";
const STUDIO_NAME = "Elsie Lash Studio";

let sendGridDebugLogged = false;

/**
 * Read SendGrid config at send time (not at module load) so dotenv is always applied first.
 * Uses only: SENDGRID_API_KEY, SENDER_EMAIL, ADMIN_NOTIFICATION_EMAIL
 */
function getSendgridEnv() {
  const keyRaw = process.env.SENDGRID_API_KEY;
  const key = typeof keyRaw === "string" ? keyRaw.trim() : "";
  const senderEmail = typeof process.env.SENDER_EMAIL === "string" ? process.env.SENDER_EMAIL.trim() : "";
  const adminEmail =
    typeof process.env.ADMIN_NOTIFICATION_EMAIL === "string"
      ? process.env.ADMIN_NOTIFICATION_EMAIL.trim()
      : "";
  return { key, senderEmail, adminEmail };
}

/**
 * Set API key from env; safe debug (no secrets) once per process.
 */
function ensureSendGridKey() {
  const { key, senderEmail, adminEmail } = getSendgridEnv();
  if (!sendGridDebugLogged) {
    sendGridDebugLogged = true;
    console.log("[emailService] SENDGRID_API_KEY is set:", Boolean(key));
    console.log("[emailService] SENDGRID_API_KEY starts with 'SG.':", key.startsWith("SG."));
    console.log("[emailService] SENDER_EMAIL is set:", Boolean(senderEmail));
    console.log("[emailService] ADMIN_NOTIFICATION_EMAIL is set:", Boolean(adminEmail));
  }
  if (key) {
    sgMail.setApiKey(key);
  }
}

function isSendGridReady() {
  const { key, senderEmail, adminEmail } = getSendgridEnv();
  return Boolean(key && senderEmail && adminEmail);
}

/**
 * @param {string} [s]
 * @returns {boolean}
 */
export function isValidCustomerEmail(s) {
  if (s == null || typeof s !== "string") return false;
  const t = s.trim();
  if (t.length < 3 || t.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

/**
 * @param {string} dateStr
 * @returns {string}
 */
function formatAppointmentDateTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleString("en-AU", {
      timeZone: TIME_ZONE,
      dateStyle: "long",
      timeStyle: "short",
    });
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(dateStr).trim())) {
    const [y, m, day] = String(dateStr).split("-");
    return `${day}/${m}/${y} (date only -- we will confirm a time with you if needed)`;
  }
  return String(dateStr);
}

/**
 * @param {Object} data
 * @param {string} data.fullName
 * @param {string} [data.email] client email (optional, may be empty)
 * @param {string} data.phone
 * @param {string} data.service
 * @param {string} data.date
 * @param {string} [data.notes]
 * @returns {Promise<void>}
 */
export async function sendAdminBookingEmail(data) {
  if (!isSendGridReady()) {
    ensureSendGridKey();
    console.warn(
      "[emailService] SendGrid not configured: SENDGRID_API_KEY, SENDER_EMAIL, and ADMIN_NOTIFICATION_EMAIL must be set. Skipping admin notification."
    );
    return;
  }

  ensureSendGridKey();
  const { senderEmail, adminEmail } = getSendgridEnv();

  const fullName = data.fullName ?? "";
  const clientEmail = (data.email && String(data.email).trim()) || "";
  const phone = data.phone ?? "";
  const service = data.service ?? "";
  const date = data.date ?? "";
  const notes = data.notes ?? "";
  const when = formatAppointmentDateTime(date);

  const text = `A new booking request has been received.

Name: ${fullName}
Email: ${clientEmail || "(not provided)"}
Phone: ${phone}
Service: ${service}
Preferred date / time: ${when}
Raw date value: ${date}
Notes: ${notes || "—"}
`;

  const msg = {
    to: adminEmail,
    from: senderEmail,
    subject: `New booking — ${fullName} — ${service}`,
    text,
  };

  await sgMail.send(msg);
}

/**
 * @param {Object} data
 * @returns {Promise<void>}
 */
export async function sendCustomerConfirmationEmail(data) {
  if (!isSendGridReady()) {
    ensureSendGridKey();
    console.warn(
      "[emailService] SendGrid not configured. Skipping customer confirmation."
    );
    return;
  }

  if (!isValidCustomerEmail(data.email)) {
    return;
  }

  ensureSendGridKey();
  const { senderEmail } = getSendgridEnv();

  const to = String(data.email).trim();
  const fullName = data.fullName ?? "";
  const service = data.service ?? "";
  const when = formatAppointmentDateTime(data.date ?? "");

  const subject = `We received your booking request — ${STUDIO_NAME}`;

  const text = `Hi ${fullName},

Thank you for booking with ${STUDIO_NAME}. We have received your request and will confirm your appointment details shortly.

Appointment details
-------------------
Name: ${fullName}
Service: ${service}
Date and time: ${when}

If we need to adjust the time or have any questions, we will contact you using the details you provided.

We look forward to seeing you,
${STUDIO_NAME}
`;

  const safeName = escapeHtml(fullName);
  const safeService = escapeHtml(service);
  const safeWhen = escapeHtml(when);

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #1c1c1c; max-width: 560px; margin: 0 auto; padding: 24px;">
  <p style="font-size: 16px;">Hi ${safeName},</p>
  <p style="font-size: 16px;">Thank you for booking with <strong>${escapeHtml(
    STUDIO_NAME
  )}</strong>. We have received your request and will confirm your appointment details shortly.</p>
  <h2 style="font-size: 15px; letter-spacing: 0.12em; text-transform: uppercase; color: #6b6b6b; margin-top: 28px; border-bottom: 1px solid #e2ded5; padding-bottom: 8px;">Appointment details</h2>
  <table style="width: 100%; font-size: 15px; border-collapse: collapse;">
    <tr><td style="padding: 6px 0; color: #6b6b6b; width: 120px;">Name</td><td style="padding: 6px 0;">${safeName}</td></tr>
    <tr><td style="padding: 6px 0; color: #6b6b6b;">Service</td><td style="padding: 6px 0;">${safeService}</td></tr>
    <tr><td style="padding: 6px 0; color: #6b6b6b; vertical-align: top;">Date & time</td><td style="padding: 6px 0;">${safeWhen}</td></tr>
  </table>
  <p style="font-size: 15px; margin-top: 24px; color: #4a4a4a;">If we need to make any changes, we will reach out to you using the contact details you provided.</p>
  <p style="font-size: 15px; margin-top: 20px;">We look forward to seeing you,<br /><strong>${escapeHtml(
    STUDIO_NAME
  )}</strong></p>
</body>
</html>`;

  const msg = {
    to,
    from: senderEmail,
    subject,
    text,
    html,
  };

  await sgMail.send(msg);
}

/**
 * @param {string} s
 * @returns {string}
 */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * @deprecated Use sendAdminBookingEmail
 * @param {Object} booking
 */
export async function sendBookingNotificationEmail(booking) {
  return sendAdminBookingEmail({
    fullName: booking.fullName,
    email: booking.email,
    phone: booking.phone,
    service: booking.service,
    date: booking.date,
    notes: booking.notes,
  });
}
