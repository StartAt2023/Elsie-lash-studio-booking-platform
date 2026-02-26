import BookingForm from "@/components/BookingForm";

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white">
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-serif text-3xl font-semibold text-pink-900 sm:text-4xl">
          Book an appointment
        </h1>
        <p className="mt-2 text-pink-700/80">
          Fill out the form below and we&apos;ll get back to you to confirm.
        </p>
        <div className="mt-10">
          <BookingForm />
        </div>
      </div>
    </main>
  );
}
