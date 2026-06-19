"use client";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">Error</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
        The page hit a rough patch.
      </h1>
      <p className="mt-4 text-base leading-7 text-slate-600">
        Something unexpected happened while rendering this route. Try again, and if it keeps
        happening we can debug the segment together.
      </p>
      <button
        onClick={unstable_retry}
        className="mt-8 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
      >
        Retry
      </button>
      <p className="mt-4 text-xs text-slate-500">{error.message}</p>
    </div>
  );
}
