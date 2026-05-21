import { NextResponse } from "next/server";
import { starterSessions } from "@/lib/study-data";
import type { StudySession } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return NextResponse.json({ sessions: starterSessions });
  }

  const { data, error } = await supabase
    .from("study_sessions")
    .select("id,title,topic,summary,created_at")
    .order("created_at", { ascending: false })
    .limit(25);

  if (error) {
    return NextResponse.json({ sessions: starterSessions, warning: error.message });
  }

  return NextResponse.json({ sessions: (data ?? []) as StudySession[] });
}
