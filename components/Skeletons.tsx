export function CarCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="h-56 animate-pulse bg-zinc-200" />
      <div className="space-y-4 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-zinc-200" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-zinc-200" />
        <div className="flex gap-2">
          <div className="h-7 w-24 animate-pulse rounded-full bg-zinc-200" />
          <div className="h-7 w-28 animate-pulse rounded-full bg-zinc-200" />
        </div>
        <div className="h-11 animate-pulse rounded-2xl bg-zinc-200" />
      </div>
    </div>
  );
}

export function CarGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <CarCardSkeleton key={index} />
      ))}
    </div>
  );
}
