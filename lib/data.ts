import { createSupabaseClient } from "@/lib/supabase/server";
import type {
  Car,
  CarDetails,
  CarFilters,
  CarImage,
  CarWithPrimaryImage,
  Review,
} from "@/lib/types";

const carWithPrimaryImageSelect = `
  *,
  car_images!inner (
    id,
    car_id,
    image_url,
    is_primary
  )
`;

const carWithDetailsSelect = `
  *,
  car_images (
    id,
    car_id,
    image_url,
    is_primary
  ),
  reviews (
    id,
    car_id,
    user_name,
    rating,
    comment
  )
`;

type RawRecord = Record<string, unknown>;

export async function getFeaturedCars(limit = 6): Promise<CarWithPrimaryImage[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("cars")
    .select(carWithPrimaryImageSelect)
    .eq("status", "available")
    .eq("car_images.is_primary", true)
    .order("price_per_day", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Unable to load featured cars: ${error.message}`);
  }

  return normalizeCarsWithPrimaryImage(data);
}

export async function getRideShareCars(limit = 3): Promise<CarWithPrimaryImage[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("cars")
    .select(carWithPrimaryImageSelect)
    .eq("status", "available")
    .eq("ride_share_enabled", true)
    .eq("car_images.is_primary", true)
    .order("price_per_day", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Unable to load ride share cars: ${error.message}`);
  }

  return normalizeCarsWithPrimaryImage(data);
}

export async function getCars(filters: CarFilters = {}): Promise<CarWithPrimaryImage[]> {
  const supabase = createSupabaseClient();
  let query = supabase
    .from("cars")
    .select(carWithPrimaryImageSelect)
    .eq("status", "available")
    .eq("car_images.is_primary", true)
    .order("price_per_day", { ascending: true });

  if (typeof filters.minPrice === "number") {
    query = query.gte("price_per_day", filters.minPrice);
  }

  if (typeof filters.maxPrice === "number") {
    query = query.lte("price_per_day", filters.maxPrice);
  }

  if (filters.rideShareOnly) {
    query = query.eq("ride_share_enabled", true);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Unable to load cars: ${error.message}`);
  }

  const cars = normalizeCarsWithPrimaryImage(data);

  if (filters.category) {
    return cars.filter((car) => car.category === filters.category);
  }

  return cars;
}

export async function getCarDetails(id: string): Promise<CarDetails | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("cars")
    .select(carWithDetailsSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load car details: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return {
    ...normalizeCar(data as RawRecord),
    images: normalizeImages((data as RawRecord).car_images),
    reviews: normalizeReviews((data as RawRecord).reviews),
  };
}

export async function getCarForCheckout(id: string): Promise<CarWithPrimaryImage | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("cars")
    .select(carWithPrimaryImageSelect)
    .eq("id", id)
    .eq("car_images.is_primary", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load checkout car: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return normalizeCarWithPrimaryImage(data as RawRecord);
}

function normalizeCarsWithPrimaryImage(rows: unknown[] | null): CarWithPrimaryImage[] {
  return (rows ?? []).map((row) => normalizeCarWithPrimaryImage(row as RawRecord));
}

function normalizeCarWithPrimaryImage(row: RawRecord): CarWithPrimaryImage {
  const images = normalizeImages(row.car_images);
  const primaryImage = images.find((image) => image.is_primary) ?? images[0] ?? null;

  return {
    ...normalizeCar(row),
    primaryImage,
  };
}

function normalizeCar(row: RawRecord): Car {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    description: row.description ? String(row.description) : null,
    price_per_day: toNumber(row.price_per_day),
    weekly_rate: row.weekly_rate === null || row.weekly_rate === undefined ? null : toNumber(row.weekly_rate),
    monthly_rate: row.monthly_rate === null || row.monthly_rate === undefined ? null : toNumber(row.monthly_rate),
    ride_share_enabled: Boolean(row.ride_share_enabled),
    status: String(row.status ?? "available") as Car["status"],
    deposit: row.deposit === null || row.deposit === undefined ? null : toNumber(row.deposit),
    unlimited_miles: Boolean(row.unlimited_miles),
    category: String(row.category ?? "economy") as Car["category"],
  };
}

function normalizeImages(value: unknown): CarImage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((image) => {
    const row = image as RawRecord;
    return {
      id: String(row.id),
      car_id: String(row.car_id),
      image_url: String(row.image_url ?? ""),
      is_primary: Boolean(row.is_primary),
    };
  });
}

function normalizeReviews(value: unknown): Review[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((review) => {
    const row = review as RawRecord;
    return {
      id: String(row.id),
      car_id: String(row.car_id),
      user_name: String(row.user_name ?? "Guest"),
      rating: toNumber(row.rating),
      comment: String(row.comment ?? ""),
    };
  });
}

function toNumber(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
