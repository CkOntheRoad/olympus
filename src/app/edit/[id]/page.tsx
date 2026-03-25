"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OfferingEntry = {
  id: string;
  name: string;
  email: string;
  attendance: string;
  category: string;
  offering: string;
  note: string;
};

export default function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [entry, setEntry] = useState<OfferingEntry | null>(null);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEntry() {
      const resolvedParams = await params;
      setId(resolvedParams.id);

      const res = await fetch("/api/all-offerings");
      const allEntries = await res.json();

      const found = allEntries.find(
        (item: OfferingEntry) => item.id === resolvedParams.id
      );

      setEntry(found || null);
      setLoading(false);
    }

    loadEntry();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-24 text-white">
        <div className="mx-auto max-w-3xl">Loading...</div>
      </main>
    );
  }

  if (!entry) {
    return (
      <main className="min-h-screen bg-black px-6 py-24 text-white">
        <div className="mx-auto max-w-3xl">Entry not found.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-yellow-200/70">
          Private Adjustment
        </p>

        <h1 className="text-4xl font-semibold sm:text-5xl">
          Edit Your Offering
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
          This page is reserved for your entry alone.
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const form = e.currentTarget;
            const formData = new FormData(form);

            const data = {
              attendance: formData.get("attendance"),
              category: formData.get("category"),
              offering: formData.get("offering"),
              note: formData.get("note"),
            };

            const res = await fetch(`/api/offerings/${id}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });

            if (res.ok) {
              alert("Your offering has been updated ⚡");
            } else {
              alert("Something went wrong");
            }
          }}
          className="mt-12 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
        >
          <div>
            <label className="mb-2 block text-sm uppercase tracking-[0.25em] text-yellow-100/80">
              Name
            </label>
            <input
              value={entry.name}
              disabled
              className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-gray-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm uppercase tracking-[0.25em] text-yellow-100/80">
              Email
            </label>
            <input
              value={entry.email}
              disabled
              className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-gray-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm uppercase tracking-[0.25em] text-yellow-100/80">
              Attendance
            </label>
            <select
              name="attendance"
              defaultValue={entry.attendance}
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
              defaultValue={entry.category}
              className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white focus:border-yellow-200/40 focus:outline-none"
            >
              <option>Side Dish</option>
              <option>Drinks</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm uppercase tracking-[0.25em] text-yellow-100/80">
              Offering
            </label>
            <input
              name="offering"
              type="text"
              defaultValue={entry.offering}
              className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white focus:border-yellow-200/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm uppercase tracking-[0.25em] text-yellow-100/80">
              Note
            </label>
            <textarea
              name="note"
              rows={4}
              defaultValue={entry.note}
              className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white focus:border-yellow-200/40 focus:outline-none"
            ></textarea>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
            <button
              type="submit"
              className="w-full rounded-full border border-yellow-200/40 bg-yellow-200/10 px-6 py-3 text-sm uppercase tracking-[0.25em] text-yellow-100 transition hover:bg-yellow-200/20 sm:w-auto"
            >
              Update Offering
            </button>

            <Link
              href="/"
              className="text-sm uppercase tracking-[0.25em] text-gray-300 transition hover:text-white"
            >
              Return to Olympus
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
