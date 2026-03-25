
"use client";
import "./globals.css";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
  // 🔹 REVEAL ON SCROLL
  const elements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  elements.forEach((el) => observer.observe(el));

  // ⚡ LIGHTNING SPARK EFFECT (click)
  const createSpark = (x: number, y: number) => {
    const spark = document.createElement("div");
    spark.className = "spark";
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.setProperty("--dx", `${(Math.random() - 0.5) * 80}px`);
    spark.style.setProperty("--dy", `${(Math.random() - 0.5) * 80}px`);

    document.body.appendChild(spark);

    setTimeout(() => spark.remove(), 700);
  };

  const handleClick = (e: MouseEvent) => {
    for (let i = 0; i < 8; i++) {
      createSpark(e.clientX, e.clientY);
    }
  };

  window.addEventListener("click", handleClick);

  // 🎬 PARALLAX + ⚡ FLASH
  let lastFlash = 0;

  const handleScroll = () => {
    const scrolled = window.scrollY;

    const bg = document.querySelector(".parallax-bg") as HTMLElement | null;
    if (bg) {
      bg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }

    const now = Date.now();
    if (now - lastFlash > 3000 && Math.random() < 0.08) {
      const flash = document.createElement("div");
      flash.className = "lightning-flash";
      document.body.appendChild(flash);

      setTimeout(() => flash.remove(), 400);
      lastFlash = now;
    }
  };

  window.addEventListener("scroll", handleScroll);

  // ✨ FLOATING DIVINE DUST (mobile optimized)
  const createParticle = () => {
    const particle = document.createElement("div");
    particle.className = "divine-particle";

    const size = 4 + Math.random() * 6;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    particle.style.opacity = `${0.2 + Math.random() * 0.4}`;
    particle.style.animationDuration = `${6 + Math.random() * 6}s`;

    particle.style.setProperty("--dx", `${(Math.random() - 0.5) * 200}px`);
    particle.style.setProperty("--dy", `${(Math.random() - 0.5) * 200}px`);

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 12000);
  };

  const particleInterval = window.setInterval(
    () => {
      createParticle();
    },
    window.innerWidth < 768 ? 900 : 500
  );

  // ⚡ ZEUS EASTER EGG (safe version)
  let lastZeusTrigger = 0;

  const triggerZeus = () => {
    const now = Date.now();

    if (now - lastZeusTrigger < 6000) return;
    lastZeusTrigger = now;

    const storm = document.createElement("div");
    storm.className = "storm-flash";
    document.body.appendChild(storm);

    const mainBolt = document.createElement("div");
    mainBolt.className = "zeus-bolt";
    document.body.appendChild(mainBolt);

    const branchBolt = document.createElement("div");
    branchBolt.className = "zeus-bolt branch";
    document.body.appendChild(branchBolt);

    const message = document.createElement("div");
    message.className = "zeus-message";
    message.textContent = "Zeus is watching";
    document.body.appendChild(message);

    for (let i = 0; i < 18; i++) {
      createSpark(window.innerWidth / 2, window.innerHeight * 0.28);
    }

    setTimeout(() => storm.remove(), 900);
    setTimeout(() => mainBolt.remove(), 900);
    setTimeout(() => branchBolt.remove(), 800);
    setTimeout(() => message.remove(), 2200);
  };

  const handleKey = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    const tag = target?.tagName;

    const isTypingField =
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      target?.isContentEditable;

    if (isTypingField) return;

    if (e.key.toLowerCase() === "z") {
      triggerZeus();
    }
  };

  window.addEventListener("keydown", handleKey);

  // 🧹 CLEANUP
  return () => {
    window.removeEventListener("click", handleClick);
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("keydown", handleKey);
    window.clearInterval(particleInterval);
    observer.disconnect();
  };
}, []);


  return (
    <main className="bg-black text-white">
 
 {/* HERO */}
<section className="relative flex min-h-screen items-center justify-center overflow-hidden">
  <div className="absolute inset-0 overflow-hidden">
    {/* Desktop background */}
    <div
      className="parallax-bg absolute inset-0 hidden bg-cover bg-center opacity-80 md:block"
      style={{ backgroundImage: "url('/olympus2.png')" }}
    ></div>

    {/* Mobile background */}
    <div
      className="parallax-bg absolute inset-0 bg-cover bg-center opacity-80 md:hidden"
      style={{ backgroundImage: "url('/olympus-mobile.png')" }}
    ></div>

    {/* Veil */}
    <div
      className="absolute inset-y-0 left-0 w-2/3 bg-contain bg-left bg-no-repeat opacity-30 mix-blend-screen pointer-events-none"
      style={{
        backgroundImage: "url('/veil.png')",
        animation: "clouds 60s ease-in-out infinite alternate",
      }}
    ></div>

    {/* Mist */}
    <div className="hero-mist"></div>
  </div>

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/40"></div>

  {/* Glow overlay */}
  <div
    className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.25),transparent_40%)]"
    style={{ animation: "glowPulse 6s ease-in-out infinite" }}
  ></div>

  <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
    <p className="mb-6 text-sm uppercase tracking-[0.5em] text-yellow-200/70">
      A Divine Invitation
    </p>

    <h1 className="text-5xl font-semibold tracking-[0.05em] leading-tight drop-shadow-[0_0_20px_rgba(255,215,0,0.15)] sm:text-6xl md:text-7xl">
      The Gathering on Olympus
    </h1>

    <p className="mx-auto mt-8 max-w-2xl text-lg leading-9 text-gray-200 sm:text-xl">
      The gods have grown restless.
    </p>

    <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-300">
      You already know why you are here.
    </p>

    <div className="mt-14 flex flex-col items-center justify-center gap-4">
      <a
        href="#summons"
        className="olympus-button rounded-full border border-yellow-200/40 bg-yellow-200/10 px-6 py-3 text-sm uppercase tracking-[0.25em] text-yellow-100 transition hover:bg-yellow-200/20"
      >
        Answer the Summons
      </a>
    </div>
  </div>
</section>


      {/* DETAILS */}
      <section className="reveal reveal-delay-1 relative overflow-hidden bg-gradient-to-b from-black via-zinc-900 to-black py-20 sm:py-28 text-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.25),transparent_40%)]"></div>

        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-yellow-200/70">
            A Divine Summons
          </p>

          <h2 className="mb-10 text-4xl font-semibold tracking-[0.03em] text-white sm:text-5xl">
            The Details
          </h2>

<div className="mt-14 space-y-6 text-center">
  {/* DATE */}
  <p className="text-4xl sm:text-5xl font-semibold tracking-[0.08em] text-yellow-100/90">
    20 June
  </p>

  {/* subtle divider */}
  <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-yellow-200/60 to-transparent animate-[divineLine_4s_ease-in-out_infinite]"></div>

  {/* TIME */}
  <p className="text-xl sm:text-2xl tracking-[0.3em] text-yellow-200/70">
    17:00
  </p>

  {/* LOCATION */}

</div>
<div className="location-panel mt-14">
  <div className="location-info">
    <p className="text-xs uppercase tracking-[0.35em] text-yellow-200/65">
      Path to Olympus
    </p>

    <h3 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
      45a, rue Principale
    </h3>

    <p className="mt-3 text-base text-gray-400">
      6990 Rameldange
    </p>

    <p className="mt-6 max-w-sm text-sm leading-7 text-gray-500">
      The road is known. Follow it well.
    </p>

    <a
      href="https://maps.google.com/?q=45a%20rue%20Principale%2C%206990%20Rameldange"
      target="_blank"
      rel="noopener noreferrer"
      className="olympus-button mt-8 inline-flex w-fit rounded-full border border-yellow-200/40 bg-yellow-200/10 px-6 py-3 text-sm uppercase tracking-[0.25em] text-yellow-100 transition hover:bg-yellow-200/20"
    >
      Open the Path
    </a>
  </div>

  <div className="location-map">
    <div className="map-overlay"></div>

    <iframe
      title="Map to Rameldange"
      src="https://www.google.com/maps?q=45a%20rue%20Principale%2C%206990%20Rameldange&output=embed"
      className="map-frame"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</div>

        </div>
      </section>

{/* LIVE BAND */}
<section className="reveal reveal-delay-1 relative overflow-hidden py-20 sm:py-28">
  {/* background image */}
  <div className="absolute inset-0">
    <div
      className="absolute inset-0 bg-cover bg-center opacity-40"
      style={{ backgroundImage: "url('/music.png')" }}
    ></div>

    {/* cool dark overlay */}
    <div className="absolute inset-0 bg-black/45"></div>

    {/* soft white glow (different from feast!) */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_50%)]"></div>
  </div>

  {/* content */}
  <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
    <p className="mb-4 text-sm uppercase tracking-[0.4em] text-yellow-200/70">
      Sound from Above
    </p>

    <h2 className="mb-6 text-4xl font-semibold tracking-[0.03em] text-white sm:text-5xl">
      Music for the Gods
    </h2>

    <p className="max-w-2xl text-lg leading-9 text-gray-300">
      Even Olympus requires a rhythm.
      <br />
      A live performance will carry the night.
    </p>
  </div>
</section>

      {/* DRESS CODE */}
      <section className="reveal reveal-delay-3 relative overflow-hidden bg-gradient-to-b from-black via-zinc-900 to-black py-20 sm:py-28 text-center">

        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom,rgba(255,215,0,0.2),transparent_40%)]"></div>

        <div className="relative z-10 mx-auto max-w-2xl px-6">
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-yellow-200/70">
            Expectation
          </p>

          <h2 className="mb-8 text-4xl font-semibold tracking-[0.03em] text-white sm:text-5xl">
            Appearance Matters
          </h2>

          <p className="text-lg leading-9 text-gray-300">
            The gods do not welcome the ordinary.
            <br />
            Dress accordingly.
          </p>
        </div>
      </section>

{/* FEAST */}
<section className="reveal reveal-delay-1 interactive-glow relative overflow-hidden py-20 sm:py-28 text-center">
  {/* 🔥 background image */}
  <div className="absolute inset-0">
    <div
      className="absolute inset-0 bg-cover bg-center opacity-35"
      style={{ backgroundImage: "url('/feast.png')" }}
    ></div>

    {/* dark overlay */}
    <div className="absolute inset-0 bg-black/40"></div>

    {/* warm glow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,180,60,0.25),transparent_60%)]"></div>
  </div>

  {/* ✨ subtle particles glow overlay (ties into your dust system) */}
  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.18),transparent_40%)]"></div>

  {/* content */}
  <div className="relative z-10 mx-auto max-w-3xl px-6">
    <p className="mb-4 text-sm uppercase tracking-[0.4em] text-yellow-200/70">
      Offerings to the Gods
    </p>

    <h2 className="mb-6 text-4xl font-semibold tracking-[0.03em] text-white sm:text-5xl">
      The Feast
    </h2>

    <p className="mx-auto max-w-2xl text-lg leading-9 text-gray-300">
      The fire and the meat shall be provided.
      <br />
      Bring a worthy offering to honour the table.
    </p>
  </div>
</section>

      {/* RSVP FORM */}
      <section
        id="summons"
        className="reveal reveal-delay-2 relative overflow-hidden bg-gradient-to-b from-black via-zinc-900 to-black py-24 sm:py-32"
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.16),transparent_40%)]"></div>

        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.4em] text-yellow-200/70">
              Answer the Summons
            </p>

            <h2 className="text-4xl font-semibold tracking-[0.03em] text-white sm:text-5xl">
              Will You Ascend?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-gray-300">
              Tell Olympus whether you will attend and, if you do, what offering
              you intend to bring.
            </p>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const form = e.currentTarget;
              const formData = new FormData(form);

              const data = {
                name: formData.get("name"),
                email: formData.get("email"),
                attendance: formData.get("attendance"),
                category: formData.get("category"),
                offering: formData.get("offering"),
                note: formData.get("note"),
              };

              const res = await fetch("/api/offerings", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              });

const result = await res.json();

if (res.ok) {
  alert(result.warning || "Your offering has been recorded ⚡");
  form.reset();
} else {
  alert(result.error || "Something went wrong");
}

            }}
            className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm"
          >
            <div>
              <label className="mb-2 block text-sm uppercase tracking-[0.25em] text-yellow-100/80">
                Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="Your mortal name"
                className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-gray-500 focus:border-yellow-200/40 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm uppercase tracking-[0.25em] text-yellow-100/80">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="your@email.com"
                className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-gray-500 focus:border-yellow-200/40 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm uppercase tracking-[0.25em] text-yellow-100/80">
                Attendance
              </label>
              <select
                name="attendance"
                className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white focus:border-yellow-200/40 focus:outline-none"
              >
                <option>Yes, I will ascend</option>
                <option>No, fate keeps me away</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm uppercase tracking-[0.25em] text-yellow-100/80">
                Category
              </label>
              <select
                name="category"
                className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white focus:border-yellow-200/40 focus:outline-none"
              >
                <option>Side Dish</option>
                <option>Drinks</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm uppercase tracking-[0.25em] text-yellow-100/80">
                Your Offering
              </label>
              <input
                name="offering"
                type="text"
                placeholder="Potato salad, bread, wine..."
                className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-gray-500 focus:border-yellow-200/40 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm uppercase tracking-[0.25em] text-yellow-100/80">
                Note
              </label>
              <textarea
                name="note"
                rows={4}
                placeholder="Anything Olympus should know?"
                className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-gray-500 focus:border-yellow-200/40 focus:outline-none"
              ></textarea>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
              <button
                type="submit"
                className="olympus-button w-full rounded-full border border-yellow-200/40 bg-yellow-200/10 px-6 py-3 text-sm uppercase tracking-[0.25em] text-yellow-100 transition hover:bg-yellow-200/20 sm:w-auto"
              >
                Make Your Offering
              </button>

              <Link
                href="/offerings"
                className="text-sm uppercase tracking-[0.25em] text-gray-300 transition hover:text-white"
              >
                View Other Offerings
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* CLOSING */}
      <section className="reveal reveal-delay-3 relative overflow-hidden bg-black py-20 sm:py-28 text-center">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.2),transparent_45%)]"></div>

        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <h2 className="text-4xl font-semibold tracking-[0.03em] text-white sm:text-5xl">
            The Gods Will Gather
          </h2>

          <p className="mt-6 text-lg leading-9 text-gray-300">
            Prepare accordingly.
          </p>
        </div>
      </section>
    </main>
  );
}
