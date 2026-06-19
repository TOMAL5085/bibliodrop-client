export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-sm">
        <span className="h-3 w-3 animate-pulse rounded-full bg-amber-400" />
        <span className="text-sm font-medium text-slate-600">Loading BiblioDrop...</span>
      </div>
    </div>
  );
}
