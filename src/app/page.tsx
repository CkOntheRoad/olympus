import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.16),transparent_30%),radial-gradient(circle_at_bottom,rgba(120,119,198,0.18),transparent_35%),linear-gradient(to_bottom,#000000,#0a0a0f,#000000)]" />

      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-[8%] top-[12%] h-40 w-40 rounded-full bg-yellow-200/10 blur-3xl" />
        <div className="absolute right-[10%] top-[20%] h-56 w-56 rounded-full bg-purple-400/10 blur-3xl" />
        <div className="absolute bottom-[15%] left-[18%] h-52 w-52 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-yellow-100/80 backdrop-blur-md">
          Digital Space
        </div>

        <h1 className="olympus-heading max-w-5xl text-5xl font-semibold leading-tight tracking-[0.04em] sm:text-6xl md:text-7xl lg:text-8xl">
          Welcome to the
          <span className="block bg-gradient-to-r from-yellow-100 via-white to-yellow-200 bg-clip-text text-transparent">
            Kyster World
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-300 sm:text-xl">
          This page is still under construction.
        </p>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
          Something immersive, elegant, and worth the wait is taking shape.
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/olympus"
            className="rounded-full border border-yellow-200/30 bg-yellow-200/10 px-7 py-3 text-sm uppercase tracking-[0.25em] text-yellow-100 transition hover:bg-yellow-200/20 hover:shadow-[0_0_30px_rgba(255,215,0,0.15)]"
          >
            Enter Olympus
          </Link>

          <div className="rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm uppercase tracking-[0.25em] text-gray-300 backdrop-blur-md">
            More realms soon
          </div>
        </div>

        <div className="mt-20 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.3em] text-yellow-100/70">
              Status
            </p>
            <h2 className="mt-3 text-xl font-medium text-white">
              Under Construction
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              The foundation is live, but the full experience is still being crafted.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.3em] text-yellow-100/70">
              Active Realm
            </p>
            <h2 className="mt-3 text-xl font-medium text-white">
              Olympus
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              The first destination is already open and ready to be explored.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.3em] text-yellow-100/70">
              Coming Next
            </p>
            <h2 className="mt-3 text-xl font-medium text-white">
              New Worlds
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              More projects, portals, and experiences will appear here over time.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}