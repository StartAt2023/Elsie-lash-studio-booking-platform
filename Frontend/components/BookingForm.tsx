"use client";

import { useState } from "react";

const SERVICES = [
  "Classic Lashes",
  "Volume Lashes",
  "Lash Lift & Tint",
  "Hybrid Lashes",
  "Lash Fill",
];

export default function BookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    service: "",
    date: "",
    notes: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-borderSoft/60 bg-white p-10 text-center shadow-soft sm:p-14">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold text-cream shadow-soft">
          <CheckIcon />
        </div>
        <h2 className="mt-8 font-serif text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
          Request received
        </h2>
        <p className="mt-4 leading-relaxed text-muted">
          Thank you, {formData.fullName || "there"}! We&apos;ll be in touch soon
          to confirm your appointment.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              fullName: "",
              phone: "",
              service: "",
              date: "",
              notes: "",
            });
          }}
          className="mt-10 rounded-full bg-gold px-8 py-3.5 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-borderSoft/60 bg-white p-8 shadow-soft sm:p-10"
    >
      <div className="space-y-8">
        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-medium tracking-luxury text-charcoal"
          >
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full rounded-xl border border-borderSoft/60 bg-cream/50 px-4 py-3.5 text-charcoal placeholder-muted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium tracking-luxury text-charcoal"
          >
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="(061) 123456789"
            className="w-full rounded-xl border border-borderSoft/60 bg-cream/50 px-4 py-3.5 text-charcoal placeholder-muted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>

        <div>
          <label
            htmlFor="service"
            className="mb-2 block text-sm font-medium tracking-luxury text-charcoal"
          >
            Service
          </label>
          <select
            id="service"
            name="service"
            required
            value={formData.service}
            onChange={handleChange}
            className="w-full rounded-xl border border-borderSoft/60 bg-cream/50 px-4 py-3.5 text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          >
            <option value="">Select a service</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="date"
            className="mb-2 block text-sm font-medium tracking-luxury text-charcoal"
          >
            Preferred date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-xl border border-borderSoft/60 bg-cream/50 px-4 py-3.5 text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>

        <div>
          <label
            htmlFor="notes"
            className="mb-2 block text-sm font-medium tracking-luxury text-charcoal"
          >
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any special requests or questions..."
            className="w-full resize-none rounded-xl border border-borderSoft/60 bg-cream/50 px-4 py-3.5 text-charcoal placeholder-muted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-10 w-full rounded-full bg-gold py-4 text-sm font-medium tracking-luxury text-cream shadow-soft transition hover:bg-[#b5965f] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream sm:w-auto sm:px-12"
      >
        Submit booking request
      </button>
    </form>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-8 w-8"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
        clipRule="evenodd"
      />
    </svg>
  );
}
