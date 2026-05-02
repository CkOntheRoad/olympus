import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function OfferingsPage() {
  const { data: offerings, error } = await supabase
    .from("offerings")
    .select("id, name, category, offering, attendance")
    .eq("attendance", "Yes, I will ascend")
    .not("name", "is", null)
    .not("offering", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Failed to load offerings");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden py-28 text-center">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.2),transparent_45%)]"></div>

        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-yellow-200/70">
            The Feast
          </p>

          <h1 className="text-4xl font-semibold sm:text-5xl">
            Offerings Already Promised
          </h1>

          <p className="mt-6 text-lg text-gray-300">
            See what has already been pledged to the gods.
          </p>

          <div className="mt-10">
            <Link
              href="/olympus"
              className="rounded-full border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.25em] text-white transition hover:bg-white/10"
            >
              Return to Olympus
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
  <p className="mx-auto mb-3 max-w-4xl text-xs uppercase tracking-[0.25em] text-yellow-200/50">
    Swipe sideways to see all offerings →
  </p>

  <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
    <div className="w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
      <table className="w-[760px] text-left text-sm">
        <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-[0.25em] text-yellow-100/80">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Offering</th>
          </tr>
        </thead>

        <tbody className="text-gray-200">
          {offerings && offerings.length > 0 ? (
            offerings.map((item) => (
              <tr
                key={item.id}
                className="border-b border-white/10 last:border-b-0"
              >
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4">{item.offering}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-6 py-6 text-gray-400" colSpan={3}>
                No offerings have been pledged yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</section>
    </main>
  );
}