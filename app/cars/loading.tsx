import { CarGridSkeleton } from "@/components/Skeletons";

export default function CarsLoading() {
  return (
    <main className="container-page py-10">
      <div className="mb-8 h-36 animate-pulse rounded-[2rem] bg-zinc-100" />
      <CarGridSkeleton count={9} />
    </main>
  );
}
