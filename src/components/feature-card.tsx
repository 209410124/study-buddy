type FeatureCardProps = {
  label: string;
  title: string;
  description: string;
};

export function FeatureCard({ label, title, description }: FeatureCardProps) {
  return (
    <article className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm shadow-sky-100/70">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
        {label}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </article>
  );
}
