import { AppHeader } from "@/components/app-header";
import { HomeContent } from "@/components/home-content";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50 text-slate-950">
      <AppHeader />
      <HomeContent />
    </div>
  );
}
