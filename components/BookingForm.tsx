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
      <div className="rounded-2xl border border-pink-200 bg-pink-50/60 p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-white">
          <CheckIcon />
        </div>
        <h2 className="mt-6 font-serif text-2xl font-semibold text-pink-900 sm:text-3xl">
          Request received
        </h2>
        <p className="mt-3 text-pink-700">
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
          className="mt-8 rounded-full bg-pink-500 px-6 py-3 font-medium text-white transition hover:bg-pink-600"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-pink-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="space-y-6">
        <div>
          <label
            htmlFor="fullName"
            className="mb-1.5 block text-sm font-medium text-pink-900"
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
            className="w-full rounded-lg border border-pink-200 bg-pink-50/50 px-4 py-3 text-pink-900 placeholder-pink-400/70 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/30"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-pink-900"
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
            className="w-full rounded-lg border border-pink-200 bg-pink-50/50 px-4 py-3 text-pink-900 placeholder-pink-400/70 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/30"
          />
        </div>

        <div>
          <label
            htmlFor="service"
            className="mb-1.5 block text-sm font-medium text-pink-900"
          >
            Service
          </label>
          <select
            id="service"
            name="service"
            required
            value={formData.service}
            onChange={handleChange}
            className="w-full rounded-lg border border-pink-200 bg-pink-50/50 px-4 py-3 text-pink-900 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/30"
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
            className="mb-1.5 block text-sm font-medium text-pink-900"
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
            className="w-full rounded-lg border border-pink-200 bg-pink-50/50 px-4 py-3 text-pink-900 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/30"
          />
        </div>

        <div>
          <label
            htmlFor="notes"
            className="mb-1.5 block text-sm font-medium text-pink-900"
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
            className="w-full resize-none rounded-lg border border-pink-200 bg-pink-50/50 px-4 py-3 text-pink-900 placeholder-pink-400/70 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/30"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-8 w-full rounded-full bg-pink-500 py-4 font-medium text-white shadow-md transition hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 sm:w-auto sm:px-10"
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
      className="h-7 w-7"
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
