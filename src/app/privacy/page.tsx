export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-[2.5rem] p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Privacy policy</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          Lightweight frontend privacy placeholder.
        </h1>
        <p className="mt-5 text-base leading-8 text-slate-600">
          This project currently uses mock data in the client. When connected to the Express
          backend, this page should describe how Better Auth, cookies, MongoDB, and image uploads
          are handled in production.
        </p>
      </div>
    </div>
  );
}
