import { AppHeader } from "@/components/app-header";
import { EventSelectionClient } from "@/components/event-selection-client";

export default function SelectEventPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f0f9ff_0%,#ffffff_42%,#ecfdf5_100%)] text-slate-950">
      <AppHeader />
      <main>
        <EventSelectionClient />
      </main>
    </div>
  );
}
