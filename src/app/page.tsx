import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { FeatureCard } from "@/components/feature-card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50 text-slate-950">
      <AppHeader />
      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
              Taiwan history reading practice
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              AI Study Buddy
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Practice English reading with short passages about Taiwan under Japanese rule
              from 1895 to 1945.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/chat"
                className="rounded-full bg-sky-700 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800"
              >
                Start Learning
              </Link>
              <Link
                href="/history"
                className="rounded-full border border-sky-200 bg-white px-5 py-3 text-center text-sm font-semibold text-sky-800 shadow-sm transition hover:bg-sky-50"
              >
                View History
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-xl shadow-sky-100">
            <p className="text-sm font-semibold text-emerald-700">Today&apos;s practice</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">Schools in colonial Taiwan</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Read a short Taiwan history passage, explain the main idea, find evidence, and
              connect your reasoning in your own words.
            </p>
            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl bg-sky-50 p-4">
                <p className="text-sm font-semibold text-sky-900">Question 1</p>
                <p className="mt-1 text-sm text-slate-600">What is the main idea of the passage?</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-900">Support level</p>
                <p className="mt-1 text-sm text-slate-600">Medium guidance with sentence starters.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white/75">
          <div className="mx-auto grid w-full max-w-6xl gap-4 px-6 py-12 md:grid-cols-3">
            <FeatureCard
              label="1"
              title="Guided reading"
              description="Move through main idea, evidence, and reasoning questions about Taiwan from 1895 to 1945."
            />
            <FeatureCard
              label="2"
              title="Kind feedback"
              description="Get short feedback that helps you think about colonial policies and society."
            />
            <FeatureCard
              label="3"
              title="Learning history"
              description="Review practice records focused on Taiwan during the Japanese colonial period."
            />
          </div>
        </section>
      </main>
    </div>
  );
}
