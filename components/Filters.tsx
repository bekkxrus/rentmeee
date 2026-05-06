import Link from "next/link";

import type { CarCategory } from "@/lib/types";

type FiltersProps = {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  rideShareOnly?: boolean;
  bookingParams?: Record<string, string | undefined>;
};

const categories: Array<{ value: CarCategory; label: string }> = [
  { value: "economy", label: "Economy" },
  { value: "suv", label: "SUV" },
  { value: "luxury", label: "Luxury" },
  { value: "van", label: "Van" },
];

export function Filters({
  category,
  minPrice,
  maxPrice,
  rideShareOnly,
  bookingParams = {},
}: FiltersProps) {
  return (
    <form
      action="/cars"
      className="grid gap-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-end"
    >
      {Object.entries(bookingParams).map(([key, value]) =>
        value ? <input key={key} type="hidden" name={key} value={value} /> : null,
      )}

      <label className="space-y-2 text-sm font-semibold text-zinc-800">
        Category
        <select
          name="category"
          defaultValue={category ?? ""}
          className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2 text-sm font-semibold text-zinc-800">
        Min price
        <input
          name="minPrice"
          type="number"
          min="0"
          inputMode="numeric"
          defaultValue={minPrice ?? ""}
          placeholder="$40"
          className="h-12 w-full rounded-2xl border border-zinc-200 px-4 text-base outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
        />
      </label>

      <label className="space-y-2 text-sm font-semibold text-zinc-800">
        Max price
        <input
          name="maxPrice"
          type="number"
          min="0"
          inputMode="numeric"
          defaultValue={maxPrice ?? ""}
          placeholder="$250"
          className="h-12 w-full rounded-2xl border border-zinc-200 px-4 text-base outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
        />
      </label>

      <div className="space-y-3">
        <label className="flex h-12 items-center gap-3 rounded-2xl border border-zinc-200 px-4 text-sm font-semibold text-zinc-800">
          <input
            name="rideShare"
            type="checkbox"
            value="true"
            defaultChecked={rideShareOnly}
            className="size-4 accent-yellow-400"
          />
          Uber/Lyft allowed
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="submit"
            className="rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-zinc-800"
          >
            Filter
          </button>
          <Link
            href="/cars"
            className="rounded-2xl border border-zinc-200 px-5 py-3 text-center text-sm font-black uppercase tracking-wide text-zinc-950 transition hover:border-yellow-400"
          >
            Reset
          </Link>
        </div>
      </div>
    </form>
  );
}
