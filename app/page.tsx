import Link from "next/link";

import { BookingForm } from "@/components/BookingForm";
import { CarCard } from "@/components/CarCard";
import { getFeaturedCars, getRideShareCars } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredCars, rideShareCars] = await Promise.all([
    getFeaturedCars(6),
    getRideShareCars(3),
  ]);

  return (
    <main>
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.22),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="container-page relative grid min-h-[680px] items-center gap-10 py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full bg-yellow-400 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-zinc-950">
              Orlando rentals
            </p>
            <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Rent Cars in Orlando &ndash; Fast & Easy
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Book clean, reliable cars for airport trips, family vacations, or
              ride share driving. Compare available inventory and reserve in minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-zinc-200">
              <span className="rounded-full border border-white/15 px-4 py-2">No hidden image sources</span>
              <span className="rounded-full border border-white/15 px-4 py-2">Uber/Lyft-ready options</span>
              <span className="rounded-full border border-white/15 px-4 py-2">Mobile-first checkout</span>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white/10 p-3 backdrop-blur">
            <BookingForm />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Featured cars</p>
              <h2 className="mt-2 text-3xl font-black text-zinc-950 sm:text-4xl">
                Available now
              </h2>
            </div>
            <Link href="/cars" className="btn-secondary">
              View all cars
            </Link>
          </div>

          {featuredCars.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredCars.map((car, index) => (
                <CarCard key={car.id} car={car} priority={index < 2} />
              ))}
            </div>
          ) : (
            <EmptyState message="No available cars are listed right now. Please check back soon." />
          )}
        </div>
      </section>

      <section className="bg-zinc-950 py-16 text-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="eyebrow text-yellow-300">Drive for Uber/Lyft</p>
            <h2 className="mt-3 text-4xl font-black">Ride share rentals ready for work</h2>
            <p className="mt-4 text-zinc-300">
              Choose eligible cars with clear pricing, deposits, and mileage badges before you book.
            </p>
            <Link href="/cars?rideShare=true" className="mt-7 inline-flex rounded-full bg-yellow-400 px-7 py-3 text-sm font-black uppercase tracking-wide text-zinc-950">
              See Uber allowed cars
            </Link>
          </div>

          {rideShareCars.length ? (
            <div className="grid gap-5 md:grid-cols-3">
              {rideShareCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              Ride share inventory will appear here when cars are available.
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {[
            ["4.9/5", "Guest rating from Orlando renters"],
            ["10k+", "Completed rental days"],
            ["24/7", "Fast reservation support"],
          ].map(([value, label]) => (
            <div key={value} className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
              <p className="text-5xl font-black text-zinc-950">{value}</p>
              <p className="mt-3 font-semibold text-zinc-600">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-white p-10 text-center font-semibold text-zinc-600">
      {message}
    </div>
  );
}
