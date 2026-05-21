import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { EventSelectionClient } from "@/components/event-selection-client";
import { RolePlayRoomClient } from "@/components/role-play-room-client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveRolePlayEventId } from "@/lib/taiwan-history-knowledge";

export const dynamic = "force-dynamic";

type RolePlayPageProps = {
  searchParams?: Promise<{
    event?: string;
    topic?: string;
  }>;
};

export default async function RolePlayPage({ searchParams }: RolePlayPageProps) {
  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/login");
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const params = await searchParams;
  const topic = params?.event ?? params?.topic;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f0f9ff_0%,#ffffff_42%,#ecfdf5_100%)] text-slate-950">
      <AppHeader />
      {topic ? (
        <main className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
          <RolePlayRoomClient initialEventId={resolveRolePlayEventId(topic)} />
        </main>
      ) : (
        <main>
          <EventSelectionClient mode="role-play" />
        </main>
      )}
    </div>
  );
}
