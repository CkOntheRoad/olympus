"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type OfferingEntry = {
  id: string;
  name: string;
  email: string;
  attendance: string;
  category: string;
  offering: string;
  note: string;
};

type EditPageProps = {
  params: {
    id: string;
  };
};

export default function EditPage({ params }: EditPageProps) {
  const [entry, setEntry] = useState<OfferingEntry | null>(null);
  const [attendance, setAttendance] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({
    type: null,
    text: "",
  });

  const id = params.id;
  const isAttending = attendance === "Yes, I will ascend";

  useEffect(() => {
    let isMounted = true;

    async function loadEntry() {
      try {
        setLoading(true);
        setMessage({ type: null, text: "" });

        const res = await fetch(`/api/offerings/${id}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load entry");
        }

        const data = await res.json();

        if (!isMounted) return;

        setEntry(data.entry ?? null);
        setAttendance(data.entry?.attendance ?? "");
      } catch (error) {
        console.error("Failed to load entry:", error);

        if (!isMounted) return;

        setEntry(null);
        setMessage({
          type: "error",
          text: "Could not load this offering.",
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadEntry();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-24 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg text-gray-300">Loading...</p>
        </div>
      </main>
    );
  }

  if (!entry) {
    return (
      <main className="min-h-screen bg-black px-6 py-24 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-yellow-200/70">
            Private Adjustment
          </p>

          <h1 className="olympus-heading text-4xl font-semibold sm:text-5xl">
            Entry Not Found
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            This offering could not be found, or the link is no longer valid.
          </p>

          {message.type === "error" && (
            <div className="mt-8 rounded-2xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {message.text}
            </div>
          )}

          <div className="mt-10">
            <Link
              href="/"
              className="olympus-button inline-flex rounded-full border border-yellow-200/40 bg-yellow-200/10 px-6 py-3 text-sm uppercase tracking-[0.25em] text-yellow-100 transition hover:bg-yellow-200/20"
            >
              Return to Olympus
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-yellow-200/70">
          Private Adjustment
        </p>

        <h1 className="olympus-heading text-4xl font-semibold sm:text-5xl">
          Edit Your Offering
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
          This page is reserved for your entry alone.
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setMessage({ type: null, text: "" });
            setIsSubmitting(true);

            const form = e.currentTarget;
            const formData = new FormData(form);

            const selectedAttendance = String(formData.get("attendance") || "");
            const attending = selectedAttendance === "Yes, I will ascend";

            const data = {
              attendance: selectedAttendance,
              category: attending ? formData.get("category") : "",
              offering: attending ? formData.get("offering") : "",
              note: formData.get("note"),
            };

            try {
              const res = await fetch(`/api/offerings/${id}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              });

              const result = await res.json();

              if (!res.ok) {
                throw new Error(result.error || "Something went wrong");
              }

              setMessage({
                type: "success",
                text: "Your offering has been updated ⚡",
              });

              setEntry((prev) =>
                prev
                  ? {
                      ...prev,
                      attendance: selectedAttendance,
                      category: attending
                        ? String(formData.get("category") || "")
                        : "",
                      offering: attending
                        ? String(formData.get("offering") || "")
                        : "",
                      note: String(formData.get("note") || ""),
                    }
                  : prev
              );
            } catch (error) {
              const text =
                error instanceof Error
                  ? error.message
                  : "Something went wrong";

              setMessage({
                type: "error",
                text,
              });
            } finally {
              setIsSubmitting(false);
            }
          }}
          className="mt-12 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm uppercase tracking-[0.25em] text-yellow-100/80"
            >
              Name
            </label>
            <input
              id="name"
              value={entry.name}
              disabled
              className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm uppercase tracking-[0.25em] text-yellow-100/80"
            >
              Email
            </label>
            <input
              id="email"
              value={entry.email}
              disabled
              className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="attendance"
              className="mb-2 block text-sm uppercase tracking-[0.25em] text-yellow-100/80"
            >
              Attendance
            </label>
            <select
              id="attendance"
              name="attendance"
              value={attendance}
              onChange={(e) => setAttendance(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white focus:border-yellow-200/40 focus:outline-none"
            >
              <option>Yes, I will ascend</option>
              <option>No, fate keeps me away</option>
            </select>
          </div>

          {isAttending && (
            <>
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm uppercase tracking-[0.25em] text-yellow-100/80"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  defaultValue={entry.category || "Side Dish"}
                  required={isAttending}
                  className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white focus:border-yellow-200/40 focus:outline-none"
                >
                  <option>Side Dish</option>
                  <option>Drinks</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="offering"
                  className="mb-2 block text-sm uppercase tracking-[0.25em] text-yellow-100/80"
                >
                  Offering
                </label>
                <input
                  id="offering"
                  name="offering"
                  type="text"
                  defaultValue={entry.offering}
                  required={isAttending}
                  className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white focus:border-yellow-200/40 focus:outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="note"
              className="mb-2 block text-sm uppercase tracking-[0.25em] text-yellow-100/80"
            >
              Note
            </label>
            <textarea
              id="note"
              name="note"
              rows={4}
              defaultValue={entry.note}
              className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white focus:border-yellow-200/40 focus:outline-none"
            />
          </div>

          {message.type && (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm leading-7 ${
                message.type === "success"
                  ? "border-yellow-200/30 bg-yellow-200/10 text-yellow-100"
                  : "border-red-300/30 bg-red-500/10 text-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
            <button
              type="submit"
              disabled={isSubmitting}
              className="olympus-button w-full rounded-full border border-yellow-200/40 bg-yellow-200/10 px-6 py-3 text-sm uppercase tracking-[0.25em] text-yellow-100 transition hover:bg-yellow-200/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? "Updating Offering..." : "Update Offering"}
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