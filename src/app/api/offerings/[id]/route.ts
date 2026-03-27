import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ATTENDING = "Yes, I will ascend";
const NOT_ATTENDING = "No, fate keeps me away";

const VALID_ATTENDANCE = [ATTENDING, NOT_ATTENDING] as const;
const VALID_CATEGORIES = ["Side Dish", "Drinks"] as const;

type AttendanceValue = (typeof VALID_ATTENDANCE)[number];
type CategoryValue = (typeof VALID_CATEGORIES)[number];

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return jsonError("Missing offering ID", 400);
    }

    const { data, error } = await supabaseAdmin
      .from("offerings")
      .select("id, name, email, attendance, category, offering, note")
      .eq("id", id)
      .single();

    if (error || !data) {
      return jsonError("Offering not found", 404);
    }

    return NextResponse.json({
      success: true,
      entry: {
        id: data.id,
        name: data.name ?? "",
        email: data.email ?? "",
        attendance: data.attendance ?? "",
        category: data.category ?? "",
        offering: data.offering ?? "",
        note: data.note ?? "",
      },
    });
  } catch (error) {
    console.error("Error fetching offering:", error);
    return jsonError("Failed to fetch offering", 500);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return jsonError("Missing offering ID", 400);
    }

    const body = await request.json();

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

    const { data, error } = await supabaseAdmin
      .from("offerings")
      .update({
        attendance,
        category: isAttending ? category : null,
        offering: isAttending ? offering : null,
        note: note || null,
      })
      .eq("id", id)
      .select("id, name, email, attendance, category, offering, note")
      .single();

    if (error || !data) {
      console.error("Supabase update error:", error);
      return jsonError("Failed to update offering", 500);
    }

    return NextResponse.json({
      success: true,
      entry: {
        id: data.id,
        name: data.name ?? "",
        email: data.email ?? "",
        attendance: data.attendance ?? "",
        category: data.category ?? "",
        offering: data.offering ?? "",
        note: data.note ?? "",
      },
    });
  } catch (error) {
    console.error("Error updating offering:", error);
    return jsonError("Failed to update offering", 500);
  }
}