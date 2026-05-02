import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";

const resendApiKey = process.env.RESEND_API_KEY;
const appUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.kyster.pro";
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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("offerings")
      .select("id, name, email, attendance, category, offering, note")
      .eq("id", id)
      .single();

    if (error || !data) {
      return jsonError("Offering not found", 404);
    }

    return NextResponse.json({ success: true, entry: data });
  } catch (error) {
    console.error("Error loading offering:", error);
    return jsonError("Failed to load offering", 500);
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const rawAttendance = cleanString(body.attendance);

    if (!VALID_ATTENDANCE.includes(rawAttendance as AttendanceValue)) {
      return jsonError("Invalid attendance value", 400);
    }

    const attendance = rawAttendance as AttendanceValue;
    const isAttending = attendance === ATTENDING;

    const category = cleanString(body.category);
    const offering = cleanString(body.offering);
    const note = cleanString(body.note);

    if (isAttending) {
      if (!category || !offering) {
        return jsonError("Offering details are required for attendees", 400);
      }

      if (!VALID_CATEGORIES.includes(category as CategoryValue)) {
        return jsonError("Invalid category", 400);
      }
    }

    const { data: existingEntry, error: fetchError } = await supabaseAdmin
      .from("offerings")
      .select("id, name, email")
      .eq("id", id)
      .single();

    if (fetchError || !existingEntry) {
      return jsonError("Offering not found", 404);
    }

    const name = cleanString(existingEntry.name);
    const email = cleanString(existingEntry.email).toLowerCase();

    if (!name || !email) {
      return jsonError("Missing required entry data", 400);
    }

    if (!isValidEmail(email)) {
      return jsonError("Invalid email address", 400);
    }

    const { error: updateError } = await supabaseAdmin
      .from("offerings")
      .update({
        attendance,
        category: isAttending ? category : null,
        offering: isAttending ? offering : null,
        note: note || null,
      })
      .eq("id", id);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return jsonError("Failed to update offering", 500);
    }

    const escapedName = escapeHtml(name);
    const escapedEmail = escapeHtml(email);
    const escapedAttendance = escapeHtml(attendance);
    const escapedCategory = escapeHtml(isAttending ? category : "None");
    const escapedOffering = escapeHtml(isAttending ? offering : "None");
    const escapedNote = escapeHtml(note || "None");
    const editUrl = `${appUrl}/edit/${id}`;

    try {
      if (attendance === ATTENDING) {
        await resend.emails.send({
          from: "Olympus <onboarding@resend.dev>",
          to: email,
          subject: "Your Offering Has Been Accepted ⚡",
          html: `
            <div style="background:#0a0a0a; padding:40px; text-align:center; color:#f5e6b3; font-family:Georgia, serif;">
              <img
                src="${appUrl}/olympus4.jpg"
                style="width:100%; max-width:600px; border-radius:12px;"
              />

              <p style="letter-spacing:4px; font-size:12px; margin-top:30px;">
                A DIVINE INVITATION
              </p>

              <h1 style="font-size:32px; margin:10px 0;">
                The Gathering on Olympus
              </h1>

              <p style="font-style:italic; color:#aaa; margin-top:10px;">
                The gods have taken notice.
              </p>

              <p style="color:#ccc; margin-top:18px;">
                ${escapedName}, your presence has been acknowledged.
              </p>

              <div style="margin-top:25px; line-height:1.6;">
                <p style="font-size:18px;">
                  <span style="color:#d4af37;">You bring</span><br/>
                  ${escapedOffering}
                </p>

                <p style="margin-top:12px; font-size:14px; color:#aaa;">
                  Category: ${escapedCategory}
                </p>
              </div>

              <div style="margin:30px auto; width:60px; height:1px; background:#d4af37; opacity:0.5;"></div>

              <a href="${editUrl}" style="display:inline-block;margin-top:30px;padding:14px 32px;border:1px solid #d4af37;color:#d4af37;text-decoration:none;border-radius:999px;letter-spacing:2px;font-size:14px;background:rgba(212,175,55,0.05);">
                EDIT YOUR OFFERING
              </a>

              <p style="margin-top:40px; color:#888;">
                The feast awaits. Olympus prepares.
              </p>

              <p style="margin-top:20px; font-size:12px; color:#777; letter-spacing:2px;">
                — OLYMPUS
              </p>
            </div>
          `,
        });
      } else {
        await resend.emails.send({
          from: "Olympus <onboarding@resend.dev>",
          to: email,
          subject: "Olympus Mourns Your Absence ⚡",
          html: `
            <div style="background:#0a0a0a; padding:40px; text-align:center; color:#f5e6b3; font-family:Georgia, serif;">
              <img
                src="${appUrl}/olympus5.png"
                style="width:100%; max-width:600px; border-radius:12px;"
              />

              <p style="letter-spacing:4px; font-size:12px; margin-top:30px;">
                A DIVINE LAMENT
              </p>

              <h1 style="font-size:32px; margin:10px 0;">
                The Gathering on Olympus
              </h1>

              <p style="font-style:italic; color:#aaa; margin-top:10px;">
                Even the gods know disappointment.
              </p>

              <p style="color:#ccc; margin-top:18px;">
                ${escapedName}, Olympus has received word that fate keeps you away.
              </p>

              <p style="color:#bbb; margin-top:18px;">
                You will be very missed :(
              </p>

              <div style="margin:30px auto; width:60px; height:1px; background:#d4af37; opacity:0.5;"></div>

              <a href="${editUrl}" style="display:inline-block;margin-top:30px;padding:14px 32px;border:1px solid #d4af37;color:#d4af37;text-decoration:none;border-radius:999px;letter-spacing:2px;font-size:14px;background:rgba(212,175,55,0.05);">
                I CHANGED MY MIND
              </a>

              <p style="margin-top:40px; color:#888;">
                Zeus is pretending not to take this personally.
              </p>

              <p style="margin-top:20px; font-size:12px; color:#777; letter-spacing:2px;">
                — OLYMPUS
              </p>
            </div>
          `,
        });
      }

      await resend.emails.send({
        from: "Olympus <onboarding@resend.dev>",
        to: adminEmail,
        subject:
          attendance === ATTENDING
            ? "Offering Updated / Guest Now Attending ⚡"
            : "RSVP Updated / Guest Declined ⚡",
        html: `
          <h2>${
            attendance === ATTENDING
              ? "A Guest Updated Their RSVP To Attending"
              : "A Guest Updated Their RSVP To Not Attending"
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
        warning: "Offering updated, but email failed.",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating offering:", error);
    return jsonError("Failed to update offering", 500);
  }
}