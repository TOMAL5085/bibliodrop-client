export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
      <div className="h-52 animate-pulse bg-slate-200" />
      <div className="space-y-4 p-6">
        <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
        <div className="h-6 w-3/4 animate-pulse rounded-full bg-slate-200" />
        <div className="space-y-2">
          <div className="h-3 animate-pulse rounded-full bg-slate-200" />
          <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-200" />
          <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-10 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="h-10 w-24 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
