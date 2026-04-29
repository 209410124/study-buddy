import { AppHeader } from "@/components/app-header";
import { ChatPanel } from "@/components/chat-panel";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50 text-slate-950">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
            Practice room
          </p>
          <h1 className="mt-3 text-4xl font-bold">Chat with your reading coach</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Generate or paste a passage about Taiwan under Japanese rule, then answer the
            coach&apos;s questions one step at a time.
          </p>
        </div>
        <ChatPanel />
      </main>
    </div>
  );
}
