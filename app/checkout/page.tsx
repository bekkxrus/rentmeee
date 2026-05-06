import Image from "next/image";
import Link from "next/link";

import { CheckoutForm } from "@/components/CheckoutForm";
import { getCarForCheckout } from "@/lib/data";
import { firstSearchParam, formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

type CheckoutPageProps = {
  searchParams: {
    id?: string | string[];
    pickupDate?: string | string[];
    returnDate?: string | string[];
    pickupLocation?: string | string[];
    returnLocation?: string | string[];
  };
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const carId = firstSearchParam(searchParams.id);

  if (!carId) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600">
          Select a car
        </p>
        <h1 className="mt-4 text-4xl font-black text-zinc-950">
          Choose a vehicle before checkout
        </h1>
        <p className="mt-4 text-zinc-600">
          Browse available cars and tap reserve to start a booking request.
        </p>
        <Link href="/cars" className="btn-primary mt-8 inline-flex">
          View cars
        </Link>
      </main>
    );
  }

  const car = await getCarForCheckout(carId);

  if (!car) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600">
          Not found
        </p>
        <h1 className="mt-4 text-4xl font-black text-zinc-950">
          This car is not available for checkout
        </h1>
        <Link href="/cars" className="btn-primary mt-8 inline-flex">
          Back to cars
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
      <aside className="space-y-5">
        <Link href={`/cars/${car.id}`} className="text-sm font-bold text-zinc-600 hover:text-zinc-950">
          Back to details
        </Link>
        <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
          <div className="relative aspect-[4/3] bg-zinc-100">
            {car.primaryImage?.image_url ? (
              <Image
                src={car.primaryImage.image_url}
                alt={car.name}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-semibold text-zinc-500">
                Image coming soon
              </div>
            )}
          </div>
          <div className="space-y-4 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600">
              Booking request
            </p>
            <h1 className="text-3xl font-black text-zinc-950">{car.name}</h1>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-zinc-50 p-4">
                <span className="text-zinc-500">Daily rate</span>
                <strong className="mt-1 block text-xl text-zinc-950">
                  {formatCurrency(car.price_per_day)}
                </strong>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4">
                <span className="text-zinc-500">Deposit</span>
                <strong className="mt-1 block text-xl text-zinc-950">
                  {car.deposit !== null ? formatCurrency(car.deposit) : "None"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <section>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600">
          Secure checkout
        </p>
        <h2 className="mt-3 text-4xl font-black text-zinc-950">
          Request your reservation
        </h2>
        <p className="mt-3 max-w-2xl text-zinc-600">
          We verify availability before saving your booking as pending.
        </p>
        <div className="mt-8">
          <CheckoutForm
            carId={car.id}
            pricePerDay={car.price_per_day}
            initialPickupDate={firstSearchParam(searchParams.pickupDate)}
            initialReturnDate={firstSearchParam(searchParams.returnDate)}
            initialPickupLocation={firstSearchParam(searchParams.pickupLocation)}
            initialReturnLocation={firstSearchParam(searchParams.returnLocation)}
          />
        </div>
      </section>
    </main>
  );
}
