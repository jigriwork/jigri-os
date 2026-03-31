export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 md:py-24">
        <section className="space-y-8 text-center">
          <p className="inline-flex rounded-full border border-white/20 px-3 py-1 text-xs tracking-[0.2em] text-white/80">
            JIGRI OS
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
            Billing, inventory, CRM, and control all in one.
          </h1>
          <p className="mx-auto max-w-2xl text-white/70">
            A production-grade Retail OS designed for kirana stores to enterprise chains. Built for
            desktop, tablet, and mobile from day one.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/app/dashboard"
              className="rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
            >
              Launch Workspace
            </a>
            <a
              href="/app/billing"
              className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Open Billing POS
            </a>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            "Multi-tenant workspace architecture",
            "Configurable business modes and store settings",
            "Real-time billing-ready experience",
          ].map((feature) => (
            <div key={feature} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-medium">{feature}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
