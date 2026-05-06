"use client";

import { useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { createBooking, initialBookingState } from "@/app/checkout/actions";
import { formatCurrency, calculateRentalDays, getTodayInputValue } from "@/lib/utils";

type CheckoutFormProps = {
  carId: string;
  pricePerDay: number;
  initialPickupDate?: string;
  initialReturnDate?: string;
  initialPickupLocation?: string;
  initialReturnLocation?: string;
};

export function CheckoutForm({
  carId,
  pricePerDay,
  initialPickupDate,
  initialReturnDate,
  initialPickupLocation,
  initialReturnLocation,
}: CheckoutFormProps) {
  const [state, formAction] = useFormState(createBooking, initialBookingState);
  const today = getTodayInputValue();
  const [pickupDate, setPickupDate] = useState(initialPickupDate ?? today);
  const [returnDate, setReturnDate] = useState(initialReturnDate ?? today);
  const rentalDays = calculateRentalDays(pickupDate, returnDate);
  const total = useMemo(() => rentalDays * pricePerDay, [pricePerDay, rentalDays]);

  return (
    <form action={formAction} className="space-y-5 rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/60 md:p-8">
      <input type="hidden" name="car_id" value={carId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-zinc-800">
          First name
          <input name="first_name" required className="field" placeholder="Jane" />
        </label>
        <label className="space-y-2 text-sm font-semibold text-zinc-800">
          Last name
          <input name="last_name" required className="field" placeholder="Doe" />
        </label>
        <label className="space-y-2 text-sm font-semibold text-zinc-800">
          Email
          <input name="email" type="email" required className="field" placeholder="jane@example.com" />
        </label>
        <label className="space-y-2 text-sm font-semibold text-zinc-800">
          Phone
          <input name="phone" type="tel" required className="field" placeholder="(407) 555-0123" />
        </label>
        <label className="space-y-2 text-sm font-semibold text-zinc-800">
          Pickup date
          <input
            name="pickup_date"
            type="date"
            required
            min={today}
            value={pickupDate}
            onChange={(event) => setPickupDate(event.target.value)}
            className="field"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-zinc-800">
          Return date
          <input
            name="return_date"
            type="date"
            required
            min={pickupDate || today}
            value={returnDate}
            onChange={(event) => setReturnDate(event.target.value)}
            className="field"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm font-semibold text-zinc-800">
        Pickup location
        <input
          name="pickup_location"
          required
          defaultValue={initialPickupLocation ?? "Orlando International Airport"}
          className="field"
        />
      </label>

      <label className="space-y-2 text-sm font-semibold text-zinc-800">
        Return location
        <input
          name="return_location"
          required
          defaultValue={initialReturnLocation ?? "Orlando International Airport"}
          className="field"
        />
      </label>

      <div className="rounded-3xl bg-zinc-950 p-5 text-white">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-300">Rental days</span>
          <strong>{rentalDays || "-"}</strong>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-sm text-zinc-300">Estimated total</span>
          <strong className="text-2xl text-yellow-300">{formatCurrency(total)}</strong>
        </div>
      </div>

      {state.message ? (
        <div
          className={`rounded-2xl p-4 text-sm font-semibold ${
            state.status === "success"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-red-50 text-red-700"
          }`}
          role="status"
        >
          {state.message}
        </div>
      ) : null}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-yellow-400 px-8 py-4 text-base font-black text-zinc-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Checking availability..." : "Request booking"}
    </button>
  );
}
