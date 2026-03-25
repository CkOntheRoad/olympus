import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

const filePath = path.join(process.cwd(), "data", "offerings.json");

type OfferingEntry = {
  id: string;
  name: string;
  email: string;
  attendance: string;
  category: string;
  offering: string;
  note: string;
};

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const raw = await fs.readFile(filePath, "utf-8");
    const entries = JSON.parse(raw) as OfferingEntry[];

    const newEntry: OfferingEntry = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      attendance: data.attendance,
      category: data.category,
      offering: data.offering,
      note: data.note,
    };

    entries.push(newEntry);

    await fs.writeFile(filePath, JSON.stringify(entries, null, 2));

    await resend.emails.send({
      from: "Olympus <onboarding@resend.dev>",
      to: newEntry.email,
      subject: "Your Offering Has Been Accepted ⚡",
      html: `
        <h2>The Gods Acknowledge You</h2>

  <p>${newEntry.name}, your presence has been noted.</p>

  <p><strong>You bring:</strong> ${newEntry.offering || "No offering specified"}</p>
  <p><strong>Category:</strong> ${newEntry.category || "None"}</p>

  <p>If fate changes, you may alter your offering here:</p>

  <p>
    <a href="http://localhost:3000/edit/${newEntry.id}">
      Edit your offering
    </a>
  </p>

  <p>The feast awaits. Olympus prepares.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving offering:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save offering" },
      { status: 500 }
    );
  }
}
