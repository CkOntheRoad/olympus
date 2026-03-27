import { NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

const resendApiKey = process.env.RESEND_API_KEY;
const appUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://olympus-orpin.vercel.app";
const adminEmail = process.env.ADMIN_EMAIL || "chriskyster@gmail.com";

if (!resendApiKey) {
  throw new Error("Missing RESEND_API_KEY");
}

const resend = new Resend(resendApiKey);

const ATTENDING = "Yes, I will ascend";
const NOT_ATTENDING = "No, fate keeps me away";

const VALID_ATTENDANCE = [ATTENDING, NOT_ATTENDING] as const;
const VALID_CATEGORIES = ["Side Dish", "Drinks"] as const;

type AttendanceValue = (typeof VALID_ATTENDANCE)[number];
type CategoryValue = (typeof VALID_CATEGORIES)[number];

type OfferingEntry = {
  id: string;
  name: string;
  email: string;
  attendance: AttendanceValue;
  category: CategoryValue | "";
  offering: string;
  note: string;
};

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const rawAttendance = cleanString(body.attendance);

    if (!VALID_ATTENDANCE.includes(rawAttendance as AttendanceValue)) {
      return jsonError("Invalid attendance value", 400);
    }

    const attendance = rawAttendance as AttendanceValue;
    const isAttending = attendance === ATTENDING;

    const name = cleanString(body.name);
    const email = cleanString(body.email).toLowerCase();
    const category = cleanString(body.category);
    const offering = cleanString(body.offering);
    const note = cleanString(body.note);

    if (!name || !email || !attendance) {
      return jsonError("Missing required fields", 400);
    }

    if (!isValidEmail(email)) {
      return jsonError("Invalid email address", 400);
    }

    if (isAttending) {
      if (!category || !offering) {
        return jsonError("Offering details are required for attendees", 400);
      }

      if (!VALID_CATEGORIES.includes(category as CategoryValue)) {
        return jsonError("Invalid category", 400);
      }
    }

    const newEntry: OfferingEntry = {
      id: crypto.randomUUID(),
      name,
      email,
      attendance,
      category: isAttending ? (category as CategoryValue) : "",
      offering: isAttending ? offering : "",
      note,
    };

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
      return jsonError("Failed to save offering", 500);
    }

    const escapedName = escapeHtml(newEntry.name);
    const escapedEmail = escapeHtml(newEntry.email);
    const escapedAttendance = escapeHtml(newEntry.attendance);
    const escapedCategory = escapeHtml(newEntry.category || "None");
    const escapedOffering = escapeHtml(newEntry.offering || "None");
    const escapedNote = escapeHtml(newEntry.note || "None");
    const editUrl = `${appUrl}/edit/${newEntry.id}`;

    try {
      if (newEntry.attendance === ATTENDING) {
        await resend.emails.send({
          from: "Olympus <onboarding@resend.dev>",
          to: newEntry.email,
          subject: "Your Offering Has Been Accepted ⚡",
          html: `
            <h2>The Gods Acknowledge You</h2>
            <p>${escapedName}, your response has been recorded.</p>
            <p><strong>Attendance:</strong> ${escapedAttendance}</p>
            <p><strong>You bring:</strong> ${escapedOffering}</p>
            <p><strong>Category:</strong> ${escapedCategory}</p>
            <p><strong>Note:</strong> ${escapedNote}</p>

            <p>If fate changes, you may alter your offering here:</p>

            <p>
              <a href="${editUrl}">Edit your offering</a>
            </p>

            <p>The feast awaits. Olympus prepares.</p>
          `,
        });
      }

      await resend.emails.send({
        from: "Olympus <onboarding@resend.dev>",
        to: adminEmail,
        subject:
          newEntry.attendance === ATTENDING
            ? "New Offering Submitted ⚡"
            : "Guest Declined the Summons ⚡",
        html: `
          <h2>${
            newEntry.attendance === ATTENDING
              ? "New Offering Received"
              : "A Guest Declined"
          }</h2>
          <p><strong>Name:</strong> ${escapedName}</p>
          <p><strong>Email:</strong> ${escapedEmail}</p>
          <p><strong>Attendance:</strong> ${escapedAttendance}</p>
          <p><strong>Category:</strong> ${escapedCategory}</p>
          <p><strong>Offering:</strong> ${escapedOffering}</p>
          <p><strong>Note:</strong> ${escapedNote}</p>
          <p><strong>Edit link:</strong> <a href="${editUrl}">${editUrl}</a></p>
        `,
      });
    } catch (emailError) {
      console.error("Resend email failed:", emailError);

      return NextResponse.json({
        success: true,
        warning: "Offering saved, but email failed.",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving offering:", error);
    return jsonError("Failed to save offering", 500);
  }
}