import { CarCard } from "@/components/CarCard";
import { Filters } from "@/components/Filters";
import { getCars } from "@/lib/data";
import type { CarCategory, CarFilters } from "@/lib/types";
import { firstSearchParam } from "@/lib/utils";

export const dynamic = "force-dynamic";

type CarsPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

const validCategories: CarCategory[] = ["economy", "suv", "luxury", "van"];

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const category = firstSearchParam(searchParams.category);
  const minPrice = firstSearchParam(searchParams.minPrice);
  const maxPrice = firstSearchParam(searchParams.maxPrice);
  const rideShare = firstSearchParam(searchParams.rideShare) === "true";
  const bookingDefaults = {
    pickupLocation: firstSearchParam(searchParams.pickupLocation),
    returnLocation: firstSearchParam(searchParams.returnLocation),
    pickupDate: firstSearchParam(searchParams.pickupDate),
    returnDate: firstSearchParam(searchParams.returnDate),
  };
  const filters: CarFilters = {
    category: isCategory(category) ? category : undefined,
    minPrice: parsePrice(minPrice),
    maxPrice: parsePrice(maxPrice),
    rideShareOnly: rideShare,
  };
  const cars = await getCars(filters);

  return (
    <main className="section">
      <div className="container-page space-y-8">
        <div className="max-w-3xl">
          <p className="eyebrow">Available rentals</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-zinc-950 md:text-6xl">
            Choose your Orlando rental car
          </h1>
          <p className="mt-4 text-lg text-zinc-600">
            Filter available vehicles by category, daily price, and Uber/Lyft eligibility.
          </p>
        </div>

        <Filters
          category={category}
          minPrice={minPrice}
          maxPrice={maxPrice}
          rideShareOnly={rideShare}
          bookingParams={bookingDefaults}
        />

        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-600">
            {cars.length} {cars.length === 1 ? "car" : "cars"} found
          </p>
          <p className="text-sm font-semibold text-zinc-500">Sorted by price low to high</p>
        </div>

        {cars.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cars.map((car, index) => (
              <CarCard
                key={car.id}
                car={car}
                priority={index < 3}
                checkoutParams={bookingDefaults}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-white p-10 text-center">
            <h2 className="text-2xl font-black text-zinc-950">No cars match those filters</h2>
            <p className="mt-2 text-zinc-600">Try widening your price range or clearing filters.</p>
          </div>
        )}
      </div>
    </main>
  );
}

function parsePrice(value?: string) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function isCategory(value?: string): value is CarCategory {
  return validCategories.includes(value as CarCategory);
}
