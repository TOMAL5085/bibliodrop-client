import { SkeletonCard } from "@/components/skeleton-card";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-10 w-64 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}
