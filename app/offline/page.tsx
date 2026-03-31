export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <h1 className="text-3xl font-semibold">You are offline</h1>
        <p className="mt-2 text-white/70">
          JIGRI OS is still available in limited mode and will resync automatically.
        </p>
      </div>
    </div>
  );
}
