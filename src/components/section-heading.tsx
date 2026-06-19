export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl space-y-3">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
        {title}
      </h2>
      {description ? <p className="text-base leading-7 text-slate-600">{description}</p> : null}
    </div>
  );
}
