import Link from "next/link";

const featuredServices = [
  {
    title: "Classic Lashes",
    description: "Natural, elegant extensions for everyday glamour.",
    href: "/services",
  },
  {
    title: "Volume Lashes",
    description: "Full, fluffy look with lightweight multi-dimensional fans.",
    href: "/services",
  },
  {
    title: "Lash Lift & Tint",
    description: "Lift and define your natural lashes with a lasting curl.",
    href: "/services",
  },
];

const testimonials = [
  {
    quote:
      "问一下之前顾客体验怎么样",
    author: "顾客名字",
  },
  {
    quote:
      "Elsie is incredibly skilled and the studio is so relaxing. I won't go anywhere else.",
    author: "我让我姐跟你说这个哈哈哈哈哈哈哈哈哈",
  },
  {
    quote:
      "My lashes look amazing and last forever. Professional, clean, and friendly.",
    author: "我跟你说这个哈哈哈哈哈哈",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-pink-50 to-white px-4 py-20 sm:py-28 md:py-36">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-serif text-sm uppercase tracking-[0.2em] text-pink-500 sm:text-base">
            Luxury lash studio
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-pink-900 sm:text-5xl md:text-6xl">
            Beautiful lashes,{" "}
            <span className="text-pink-600">beautiful you</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-pink-700/90">
            Expert lash extensions and lifts in a serene, professional space.
            Book your appointment today.
          </p>
          <Link
            href="/booking"
            className="mt-10 inline-block rounded-full bg-pink-500 px-8 py-4 font-medium text-white shadow-md transition hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
          >
            Book Your Appointment
          </Link>
        </div>
      </section>

      {/* Featured Services */}
      <section className="border-t border-pink-100 bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-3xl font-semibold text-pink-900 sm:text-4xl">
            Featured Services
          </h2>
          <p className="mt-2 text-pink-700/80">
            Discover our most loved lash treatments.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group rounded-2xl border border-pink-100 bg-pink-50/50 p-6 transition hover:border-pink-200 hover:bg-pink-50 hover:shadow-lg"
              >
                <h3 className="font-serif text-xl font-semibold text-pink-900 group-hover:text-pink-700">
                  {service.title}
                </h3>
                <p className="mt-2 text-pink-700/90">{service.description}</p>
                <span className="mt-4 inline-block text-sm font-medium text-pink-600 group-hover:underline">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="text-pink-600 font-medium hover:underline"
            >
              View all services
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="border-t border-pink-100 bg-pink-50/30 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-3xl font-semibold text-pink-900 sm:text-4xl">
            Elsie's Work
          </h2>
          <p className="mt-2 text-pink-700/80">
            A glimpse of the looks I create.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-xl bg-gradient-to-br from-pink-100 to-pink-200/80 flex items-center justify-center"
                aria-hidden
              >
                <span className="text-pink-400/70 text-4xl font-serif">✦</span>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/gallery"
              className="inline-block rounded-full border-2 border-pink-300 px-6 py-3 font-medium text-pink-700 transition hover:border-pink-500 hover:bg-pink-50"
            >
              View full gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-pink-100 bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-3xl font-semibold text-pink-900 sm:text-4xl">
            What clients say
          </h2>
          <p className="mt-2 text-pink-700/80">
            Real experiences from our community.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {testimonials.map(({ quote, author }) => (
              <blockquote
                key={author}
                className="rounded-2xl border border-pink-100 bg-pink-50/40 p-6 shadow-sm"
              >
                <p className="font-serif text-lg italic text-pink-800">
                  &ldquo;{quote}&rdquo;
                </p>
                <footer className="mt-4 text-sm font-medium text-pink-600">
                  — {author}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-pink-100 bg-gradient-to-b from-white to-pink-50 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold text-pink-900 sm:text-4xl">
            Get in touch
          </h2>
          <p className="mt-2 text-pink-700/80">
            We&apos;d love to hear from you.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
            <a
              href="tel:+15551234567"
              className="flex items-center gap-3 rounded-full bg-white px-6 py-4 shadow-md ring-1 ring-pink-100 transition hover:bg-pink-50 hover:ring-pink-200"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                <PhoneIcon />
              </span>
              <span className="font-medium text-pink-900">0423861689</span>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-full bg-white px-6 py-4 shadow-md ring-1 ring-pink-100 transition hover:bg-pink-50 hover:ring-pink-200"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                <InstagramIcon />
              </span>
              <span className="font-medium text-pink-900">@有需要的话可以把你的instagram账号写在这里</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-pink-100 bg-pink-50/50 px-4 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-pink-600">
          © {new Date().getFullYear()} Elsie Lash Studio. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C2.95 22.5 0 19.55 0 15.75V9A3 3 0 013 6h1.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-4.123v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
        clipRule="evenodd"
      />
    </svg>
  );
}
