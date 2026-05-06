"use client";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-600">
        Something went wrong
      </p>
      <h1 className="mt-4 text-4xl font-black text-zinc-950">We could not load this page.</h1>
      <p className="mt-4 text-zinc-600">{error.message}</p>
      <button type="button" onClick={reset} className="btn-primary mt-8">
        Try again
      </button>
    </main>
  );
}
