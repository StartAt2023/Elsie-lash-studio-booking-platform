import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

const base =
  "inline-flex items-center justify-center rounded-full text-sm font-medium tracking-luxury transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

const variants = {
  primary: `${base} bg-gold px-8 py-3.5 text-cream shadow-soft hover:bg-[#b5965f] sm:px-10 sm:py-4`,
  secondary: `${base} border border-borderSoft/80 bg-white px-8 py-3.5 text-charcoal shadow-soft hover:border-gold hover:text-gold`,
  inline: `${base} bg-gold px-6 py-2.5 text-cream shadow-soft hover:bg-[#b5965f] sm:inline-block sm:px-6`,
} as const;

type CTAButtonProps = ButtonProps & {
  variant?: keyof typeof variants;
  href?: string;
};

export default function CTAButton({
  children,
  href,
  variant = "primary",
  className = "",
  type = "button",
  disabled,
  onClick,
}: CTAButtonProps) {
  const cls = `${variants[variant]} ${className}`.trim();
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
