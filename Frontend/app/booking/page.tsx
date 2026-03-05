import BookingForm from "@/components/BookingForm";

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="mx-auto max-w-lg px-5 py-24 sm:py-32">
        <p className="font-serif text-xs font-medium uppercase tracking-luxury-wide text-muted">
          Book
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
          Book an appointment
        </h1>
        <p className="mt-4 text-muted">
          Fill out the form below and we&apos;ll get back to you to confirm.
        </p>
        <div className="mt-16">
          <BookingForm />
        </div>
      </div>
    </main>
  );
}
