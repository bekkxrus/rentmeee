"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";

import { getTodayInputValue } from "@/lib/utils";

type BookingFormProps = {
  compact?: boolean;
};

export function BookingForm({ compact = false }: BookingFormProps) {
  const router = useRouter();
  const today = getTodayInputValue();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      const normalized = String(value).trim();
      if (normalized) {
        params.set(key, normalized);
      }
    }

    router.push(`/cars${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-3xl border border-zinc-200 bg-white p-4 shadow-2xl shadow-black/10 sm:grid-cols-2 lg:grid-cols-5"
    >
      <label className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
          Pickup
        </span>
        <input
          name="pickupLocation"
          placeholder="Orlando Airport"
          className="field"
          required
        />
      </label>
      <label className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
          Return
        </span>
        <input
          name="returnLocation"
          placeholder="Same location"
          className="field"
          required
        />
      </label>
      <label className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
          Pickup date
        </span>
        <input name="pickupDate" type="date" min={today} className="field" required />
      </label>
      <label className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
          Return date
        </span>
        <input name="returnDate" type="date" min={today} className="field" required />
      </label>
      <button
        type="submit"
        className={`btn-primary ${compact ? "" : "lg:mt-7"}`}
      >
        Find cars
      </button>
    </form>
  );
}
