export type CarCategory = "economy" | "suv" | "luxury" | "van";

export type CarStatus = "available" | "rented" | "maintenance";

export type Car = {
  id: string;
  name: string;
  description: string | null;
  price_per_day: number;
  weekly_rate: number | null;
  monthly_rate: number | null;
  ride_share_enabled: boolean;
  status: CarStatus;
  deposit: number | null;
  unlimited_miles: boolean;
  category: CarCategory;
};

export type CarImage = {
  id: string;
  car_id: string;
  image_url: string;
  is_primary: boolean;
};

export type Review = {
  id: string;
  car_id: string;
  user_name: string;
  rating: number;
  comment: string | null;
};

export type CarBooking = {
  id: string;
  car_id: string;
  first_name: string;
  last_name: string;
  user_email: string;
  user_phone: string;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  return_location: string;
  total_cost: number;
  status: string;
};

export type CarWithPrimaryImage = Car & {
  primaryImage: CarImage | null;
};

export type CarDetails = Car & {
  images: CarImage[];
  reviews: Review[];
};

export type CarFilters = {
  category?: CarCategory;
  minPrice?: number;
  maxPrice?: number;
  rideShareOnly?: boolean;
};

export type BookingState = {
  status: "idle" | "success" | "error";
  message: string;
  bookingId?: string;
};

type TableDefinition<Row, Insert = Row, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      cars: TableDefinition<Car>;
      car_images: TableDefinition<CarImage>;
      car_bookings: TableDefinition<
        CarBooking,
        Omit<CarBooking, "id">,
        Partial<Omit<CarBooking, "id">>
      >;
      reviews: TableDefinition<Review>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
