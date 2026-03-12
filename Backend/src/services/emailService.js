import sgMail from "@sendgrid/mail";

const apiKey = process.env.SENDGRID_API_KEY;
const senderEmail = process.env.SENDER_EMAIL;
const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

if (apiKey) {
  sgMail.setApiKey(apiKey);
}

/**
 * Sends a plain-text notification email to the studio owner when a new booking is created.
 * Uses SENDER_EMAIL, ADMIN_NOTIFICATION_EMAIL, and SENDGRID_API_KEY from env.
 * If any config is missing or SendGrid fails, logs the error and does not throw (booking is still saved).
 *
 * @param {Object} booking - Booking document or plain object with fullName, phone, service, date, notes
 */
export async function sendBookingNotificationEmail(booking) {
  if (!apiKey || !senderEmail || !adminEmail) {
    console.warn(
      "[emailService] SendGrid not configured: SENDGRID_API_KEY, SENDER_EMAIL, and ADMIN_NOTIFICATION_EMAIL must be set. Skipping notification."
    );
    return;
  }

  const fullName = booking.fullName ?? "";
  const phone = booking.phone ?? "";
  const service = booking.service ?? "";
  const date = booking.date ?? "";
  const notes = booking.notes ?? "";

  const text = `A new booking has been made.

Name: ${fullName}
Phone: ${phone}
Service: ${service}
Date: ${date}
Notes: ${notes}
`;

  const msg = {
    to: adminEmail,
    from: senderEmail,
    subject: "New Booking Received",
    text,
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    console.error("[emailService] Failed to send booking notification:", err.message || err);
  }
}
