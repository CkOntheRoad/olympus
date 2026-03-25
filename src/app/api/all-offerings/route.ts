import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "offerings.json");

export async function GET() {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const entries = JSON.parse(raw);

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error reading offerings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to read offerings" },
      { status: 500 }
    );
  }
}
