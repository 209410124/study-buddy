import { AppHeaderClient } from "@/components/app-header-client";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function AppHeader() {
  let isLoggedIn = false;

  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();

    isLoggedIn = Boolean(data.user);
  } catch {
    isLoggedIn = false;
  }

  return <AppHeaderClient isLoggedIn={isLoggedIn} />;
}
