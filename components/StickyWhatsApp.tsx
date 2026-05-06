import { sanitizeWhatsAppNumber } from "@/lib/utils";

export function StickyWhatsApp() {
  const number = sanitizeWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
  const href = number
    ? `https://wa.me/${number}?text=${encodeURIComponent("Hi, I want to rent a car in Orlando.")}`
    : "#top";

  return (
    <a
      href={href}
      className="fixed bottom-5 right-5 z-50 rounded-full bg-yellow-400 px-5 py-3 text-sm font-black text-black shadow-2xl shadow-yellow-500/30 transition hover:-translate-y-0.5 hover:bg-yellow-300"
      target={number ? "_blank" : undefined}
      rel={number ? "noreferrer" : undefined}
      aria-label="Chat on WhatsApp"
    >
      WhatsApp
    </a>
  );
}
