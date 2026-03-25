import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";
import crypto from "crypto";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error("Missing RESEND_API_KEY");
}

const resend = new Resend(resendApiKey);

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

    const newEntry: OfferingEntry = {
      id: crypto.randomUUID(),
      name: data.name?.trim() || "",
      email: data.email?.trim() || "",
      attendance: data.attendance || "",
      category: data.category?.trim() || "",
      offering: data.offering?.trim() || "",
      note: data.note?.trim() || "",
    };

    if (!newEntry.name || !newEntry.email || !newEntry.attendance) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (
      newEntry.attendance === "Yes, I will ascend" &&
      (!newEntry.category || !newEntry.offering)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Offering details are required for attendees",
        },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabaseAdmin.from("offerings").insert([
      {
        id: newEntry.id,
        name: newEntry.name,
        email: newEntry.email,
        attendance: newEntry.attendance,
        category: newEntry.category || null,
        offering: newEntry.offering || null,
        note: newEntry.note || null,
      },
    ]);

if (insertError) {
  console.error("Supabase insert error:", insertError);
  return NextResponse.json(
    { success: false, error: insertError.message },
    { status: 500 }
  );
}


    try {
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
   <a href="https://olympus-orpin.vercel.app/edit/${newEntry.id}">
      Edit your offering
    </a>
  </p>

  <p>The feast awaits. Olympus prepares.</p>
`,
      });
    } catch (emailError) {
      console.error("Resend email failed:", emailError);

      return NextResponse.json({
        success: true,
        warning: "Offering saved, but confirmation email failed.",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving offering:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save offering" },
      { status: 500 }
    );
  }
}
