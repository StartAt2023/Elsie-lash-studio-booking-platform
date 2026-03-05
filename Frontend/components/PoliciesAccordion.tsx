"use client";

import { useState } from "react";

export interface AccordionSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface PoliciesAccordionProps {
  sections: AccordionSection[];
}

export default function PoliciesAccordion({ sections }: PoliciesAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(sections[0]?.id ?? null);

  return (
    <div className="space-y-4">
      {sections.map(({ id, title, content }) => {
        const isOpen = openId === id;
        return (
          <div
            key={id}
            className="overflow-hidden rounded-2xl border border-borderSoft/60 bg-white shadow-soft"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : id)}
              className="flex w-full items-center justify-between px-6 py-5 text-left text-sm font-medium tracking-luxury text-charcoal transition hover:bg-cream/50 sm:px-8 sm:text-base"
              aria-expanded={isOpen}
              aria-controls={`policy-${id}`}
              id={`policy-heading-${id}`}
            >
              <span>{title}</span>
              <span
                className={`ml-4 shrink-0 text-gold transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                aria-hidden
              >
                <ChevronIcon />
              </span>
            </button>
            <div
              id={`policy-${id}`}
              role="region"
              aria-labelledby={`policy-heading-${id}`}
              hidden={!isOpen}
              className="border-t border-borderSoft/60 bg-cream/30"
            >
              <div className="px-6 py-5 sm:px-8 sm:py-6">
                <div className="max-w-none text-sm leading-relaxed text-muted sm:text-base">
                  {content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChevronIcon() {
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
        d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}
