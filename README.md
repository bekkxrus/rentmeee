# RentMe Orlando

A production-ready car rental booking site built with Next.js 14, TypeScript,
TailwindCSS, Supabase, and Cloudinary-hosted image URLs stored in Supabase.

## Project structure

- `app/` - App Router pages for `/`, `/cars`, `/cars/[id]`, and `/checkout`
- `components/` - reusable UI including `CarCard`, `BookingForm`, `Filters`, `Gallery`
- `lib/data.ts` - Supabase reads for cars, primary images, galleries, and reviews
- `app/checkout/actions.ts` - booking server action with overlap availability checks
- `lib/supabase/server.ts` - Supabase JS client setup

## Environment variables

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

The app uses the existing tables only: `cars`, `car_images`, `car_bookings`, and
`reviews`.
