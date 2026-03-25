import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

type OfferingEntry = {
  id: string;
  name: string;
  email: string;
  attendance: string;
  category: string;
  offering: string;
  note: string;
};

const filePath = path.join(process.cwd(), "data", "offerings.json");

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await req.json();

    const raw = await fs.readFile(filePath, "utf-8");
    const entries = JSON.parse(raw) as OfferingEntry[];

    const updatedEntries = entries.map((entry) =>
      entry.id === id
        ? {
            ...entry,
            attendance: data.attendance,
            category: data.category,
            offering: data.offering,
            note: data.note,
          }
        : entry
    );

    await fs.writeFile(filePath, JSON.stringify(updatedEntries, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating offering:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update offering" },
      { status: 500 }
    );
  }
}
