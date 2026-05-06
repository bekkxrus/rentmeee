import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/Badge";
import { Gallery } from "@/components/Gallery";
import { getCarDetails } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

type CarDetailsPageProps = {
  params: {
    id: string;
  };
};

export default async function CarDetailsPage({ params }: CarDetailsPageProps) {
  const car = await getCarDetails(params.id);

  if (!car) {
    notFound();
  }

  return (
    <main className="bg-white">
      <section className="container-page py-8 md:py-12">
        <Link href="/cars" className="text-sm font-bold text-zinc-500 hover:text-zinc-950">
          Back to cars
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Gallery images={car.images} carName={car.name} />

          <div className="space-y-6 rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/70 md:p-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-600">
                {car.category}
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-zinc-950 md:text-5xl">
                {car.name}
              </h1>
              {car.description ? (
                <p className="mt-4 text-base leading-7 text-zinc-600">{car.description}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <PriceStat label="Per day" value={formatCurrency(car.price_per_day)} />
              <PriceStat
                label="Weekly"
                value={car.weekly_rate !== null ? formatCurrency(car.weekly_rate) : "Ask"}
              />
              <PriceStat
                label="Monthly"
                value={car.monthly_rate !== null ? formatCurrency(car.monthly_rate) : "Ask"}
              />
              <PriceStat
                label="Deposit"
                value={car.deposit !== null ? formatCurrency(car.deposit) : "No deposit"}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {car.ride_share_enabled ? <Badge>Uber Allowed</Badge> : null}
              {car.unlimited_miles ? <Badge>Unlimited Miles</Badge> : null}
              <Badge tone="light">{car.status}</Badge>
            </div>

            <Link
              href={`/checkout?id=${car.id}`}
              className="btn-primary w-full justify-center py-4 text-base"
            >
              Continue to checkout
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-100 bg-zinc-50 py-14">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="section-eyebrow">Reviews</p>
              <h2 className="text-3xl font-black text-zinc-950">What renters say</h2>
            </div>
            <p className="text-sm font-semibold text-zinc-500">
              {car.reviews.length} review{car.reviews.length === 1 ? "" : "s"}
            </p>
          </div>

          {car.reviews.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {car.reviews.map((review) => (
                <article key={review.id} className="rounded-3xl bg-white p-5 shadow-sm">
                  <div className="mb-3 text-yellow-500" aria-label={`${review.rating} out of 5 stars`}>
                    {"★".repeat(Math.max(0, Math.min(5, Math.round(review.rating))))}
                  </div>
                  <p className="text-sm leading-6 text-zinc-600">
                    {review.comment || "Great rental experience."}
                  </p>
                  <p className="mt-4 font-black text-zinc-950">{review.user_name}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500">
              No reviews yet. Be the first renter to review this car.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function PriceStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-zinc-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-2 text-xl font-black text-zinc-950">{value}</p>
    </div>
  );
}
