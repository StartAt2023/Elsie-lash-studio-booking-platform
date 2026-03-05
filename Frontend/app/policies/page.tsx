import Link from "next/link";
import PoliciesAccordion, {
  type AccordionSection,
} from "@/components/PoliciesAccordion";

const SECTIONS: AccordionSection[] = [
  {
    id: "booking-deposits",
    title: "Booking & deposits",
    content: (
      <>
        <p>
          To secure your appointment, we may request a deposit at the time of
          booking. This deposit is applied to your service total on the day.
        </p>
        <p className="mt-3">
          Deposit amount (if applicable): <strong>[多少钱？]</strong>.
          You can pay via bank transfer or the link we send after you book.
        </p>
      </>
    ),
  },
  {
    id: "cancellation-reschedule",
    title: "Cancellation & reschedule",
    content: (
      <>
        <p>
          We ask for at least 24–48 hours notice if you need to cancel or
          reschedule. That gives us time to offer your slot to someone else.
        </p>
        <p className="mt-3">
          Cancellations or changes made with less than 24 hours notice may incur
          a late cancellation fee of <strong>[多少钱？]</strong> before you can rebook. We'll always try to work
          with you when something unexpected comes up—just get in touch as soon
          as you can.
        </p>
      </>
    ),
  },
  {
    id: "no-show",
    title: "No-show policy",
    content: (
      <>
        <p>
          If you don't show up for your appointment and we haven't heard from
          you, we'll treat it as a no-show. The full service amount may be
          charged before future bookings, and we may require a deposit for
          subsequent appointments.
        </p>
        <p className="mt-3">
          If you're running late or can't make it, a quick message or call
          makes a big difference so we can adjust the schedule.
        </p>
      </>
    ),
  },
  {
    id: "late-arrival",
    title: "Late arrival",
    content: (
      <>
        <p>
          Please aim to arrive on time so we can give you the full treatment
          without rushing. If you're more than 10–15 minutes late, we may need
          to shorten your service, reschedule, or treat the appointment as
          cancelled depending on the day's schedule.
        </p>
        <p className="mt-3">
          If you know you'll be late, message us as soon as possible and we'll
          do our best to accommodate you.
        </p>
      </>
    ),
  },
  {
    id: "refund-satisfaction",
    title: "Refund & satisfaction",
    content: (
      <>
        <p>
          We don't offer refunds once a service has been completed. Lash
          extensions are a custom, one-off service and we can't "undo" the
          work.
        </p>
        <p className="mt-3">
          If you're not happy with the result, please contact us within 48–72
          hours. We're happy to offer a complimentary fix or adjustment where
          possible—your satisfaction matters to us. After that window, any
          changes would be at standard pricing.
        </p>
      </>
    ),
  },
  {
    id: "prep",
    title: "Prep requirements",
    content: (
      <>
        <p>
          To get the best result and keep the appointment smooth, please:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted">
          <li>Arrive with clean lashes—no mascara or eye makeup.</li>
          <li>Avoid oily products or heavy skincare around the eye area on the day.</li>
          <li>If you're sensitive to caffeine or find it hard to lie still, consider avoiding it before your appointment (optional but can help).</li>
        </ul>
        <p className="mt-3">
          Clean, product-free lashes help the extensions adhere properly and
          last longer.
        </p>
      </>
    ),
  },
  {
    id: "aftercare",
    title: "Aftercare & maintenance",
    content: (
      <>
        <p>
          Keep lashes dry and avoid steam, sauna, and rubbing your eyes for the
          first 24–48 hours. Use only oil-free makeup remover around the eyes,
          and avoid oil-based products on the lash line. Gently brush lashes
          with a clean spoolie to keep them neat.
        </p>
        <p className="mt-3">
          Fills are recommended every 2–3 weeks to maintain fullness as your
          natural lashes shed. We'll remind you when it's a good time to
          rebook.
        </p>
      </>
    ),
  },
  {
    id: "allergies",
    title: "Allergies & patch test",
    content: (
      <>
        <p>
          We use quality adhesives and products, but allergic reactions can
          happen. If you have sensitive skin, a history of eye or skin
          allergies, or are trying lash extensions for the first time, we
          recommend a patch test at least 24–48 hours before your full
          appointment.
        </p>
        <p className="mt-3">
          Let us know about any allergies or reactions before your booking.
          We're not liable for reactions if you choose to skip a recommended
          patch test or don't disclose known allergies.
        </p>
      </>
    ),
  },
  {
    id: "privacy",
    title: "Privacy",
    content: (
      <>
        <p>
          Your name, contact details, and booking history are used only to
          manage appointments, send reminders, and provide your service. We
          don't share your information with third parties for marketing. Data
          is stored securely and handled in line with Australian privacy
          practices.
        </p>
        <p className="mt-3">
          If you have questions about how we use your information, just ask.
        </p>
      </>
    ),
  },
];

export default function PoliciesPage() {
  return (
    <main className="min-h-screen bg-cream">
      <section className="px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl">
          <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">
            Policies
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
            Studio policies
          </h1>
          <p className="mt-4 leading-relaxed text-muted">
            Clear guidelines so we're on the same page. Based in Sydney—we're
            here to make your experience smooth and stress-free.
          </p>
        </div>
      </section>

      <section className="border-t border-borderSoft/80 px-5 pb-24 sm:pb-32">
        <div className="mx-auto max-w-2xl pt-16">
          <PoliciesAccordion sections={SECTIONS} />

          <div className="mt-16 text-center">
            <Link
              href="/booking"
              className="inline-block rounded-full bg-gold px-10 py-4 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream"
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
