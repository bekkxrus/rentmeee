import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "yellow" | "dark" | "light";
};

export function Badge({ children, tone = "yellow" }: BadgeProps) {
  const tones = {
    yellow: "border-yellow-300 bg-yellow-100 text-zinc-950",
    dark: "border-zinc-800 bg-zinc-950 text-white",
    light: "border-zinc-200 bg-white text-zinc-700",
  };

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  );
}
