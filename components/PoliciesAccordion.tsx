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
    <div className="space-y-2">
      {sections.map(({ id, title, content }) => {
        const isOpen = openId === id;
        return (
          <div
            key={id}
            className="overflow-hidden rounded-xl border border-pink-100 bg-white"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left font-medium text-pink-900 transition hover:bg-pink-50/50 sm:px-6"
              aria-expanded={isOpen}
              aria-controls={`policy-${id}`}
              id={`policy-heading-${id}`}
            >
              <span>{title}</span>
              <span
                className={`ml-2 shrink-0 text-pink-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
              className="border-t border-pink-100 bg-pink-50/30"
            >
              <div className="px-5 py-4 sm:px-6 sm:py-5">
                <div className="prose prose-pink max-w-none text-pink-800/90 text-sm leading-relaxed sm:text-base">
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
