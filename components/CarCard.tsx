import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/Badge";
import type { CarWithPrimaryImage } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type CarCardProps = {
  car: CarWithPrimaryImage;
  priority?: boolean;
  checkoutParams?: Record<string, string | undefined>;
};

export function CarCard({ car, priority = false, checkoutParams }: CarCardProps) {
  const image = car.primaryImage;
  const checkoutHref = buildCheckoutHref(car.id, checkoutParams);

  return (
    <article className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/cars/${car.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
          {image?.image_url ? (
            <Image
              src={image.image_url}
              alt={car.name}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-semibold text-zinc-500">
              Image coming soon
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-600">
              {car.category}
            </p>
            <h3 className="mt-1 text-xl font-black text-zinc-950">
              <Link href={`/cars/${car.id}`}>{car.name}</Link>
            </h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-zinc-950">
              {formatCurrency(car.price_per_day)}
            </p>
            <p className="text-xs font-semibold text-zinc-500">per day</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {car.ride_share_enabled ? <Badge>Uber Allowed</Badge> : null}
          {car.unlimited_miles ? <Badge>Unlimited Miles</Badge> : null}
          {car.deposit !== null ? (
            <Badge tone="light">Deposit {formatCurrency(car.deposit)}</Badge>
          ) : null}
        </div>

        <Link
          href={checkoutHref}
          className="inline-flex w-full items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-yellow-400 hover:text-zinc-950"
        >
          Reserve now
        </Link>
      </div>
    </article>
  );
}

function buildCheckoutHref(carId: string, checkoutParams?: Record<string, string | undefined>) {
  const params = new URLSearchParams({ id: carId });

  Object.entries(checkoutParams ?? {}).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  return `/checkout?${params.toString()}`;
}
