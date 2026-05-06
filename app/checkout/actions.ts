"use server";

import { createSupabaseClient } from "@/lib/supabase/server";
import type { BookingState } from "@/lib/types";
import { calculateRentalDays, toCurrencyNumber } from "@/lib/utils";

export const initialBookingState: BookingState = {
  status: "idle",
  message: "",
};

export async function createBooking(
  _previousState: BookingState,
  formData: FormData,
): Promise<BookingState> {
  try {
    const carId = getRequiredString(formData, "car_id");
    const firstName = getRequiredString(formData, "first_name");
    const lastName = getRequiredString(formData, "last_name");
    const email = getRequiredString(formData, "email");
    const phone = getRequiredString(formData, "phone");
    const pickupDate = getRequiredString(formData, "pickup_date");
    const returnDate = getRequiredString(formData, "return_date");
    const pickupLocation = getRequiredString(formData, "pickup_location");
    const returnLocation = getRequiredString(formData, "return_location");
    const rentalDays = calculateRentalDays(pickupDate, returnDate);

    if (!rentalDays) {
      return {
        status: "error",
        message: "Please choose a valid return date on or after the pickup date.",
      };
    }

    const supabase = createSupabaseClient();
    const { data: car, error: carError } = await supabase
      .from("cars")
      .select("id, name, price_per_day, status")
      .eq("id", carId)
      .maybeSingle();

    if (carError) {
      throw new Error(carError.message);
    }

    if (!car) {
      return {
        status: "error",
        message: "This car is no longer available.",
      };
    }

    if (car.status !== "available") {
      return {
        status: "error",
        message: "This car is currently unavailable for booking.",
      };
    }

    const { data: overlappingBookings, error: bookingCheckError } = await supabase
      .from("car_bookings")
      .select("id")
      .eq("car_id", carId)
      .lte("pickup_date", returnDate)
      .gte("return_date", pickupDate)
      .limit(1);

    if (bookingCheckError) {
      throw new Error(bookingCheckError.message);
    }

    if (overlappingBookings?.length) {
      return {
        status: "error",
        message: "Those dates are already booked for this car. Please select another range.",
      };
    }

    const totalCost = rentalDays * toCurrencyNumber(car.price_per_day);
    const { data: booking, error: insertError } = await supabase
      .from("car_bookings")
      .insert({
        car_id: carId,
        first_name: firstName,
        last_name: lastName,
        user_email: email,
        user_phone: phone,
        pickup_date: pickupDate,
        return_date: returnDate,
        pickup_location: pickupLocation,
        return_location: returnLocation,
        total_cost: totalCost,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    return {
      status: "success",
      message: "Booking request received. We will confirm availability shortly.",
      bookingId: String(booking.id),
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to create booking. Please try again.",
    };
  }
}

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Please complete all required booking fields.");
  }

  return value.trim();
}
