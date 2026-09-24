import { useMemo, useState } from "react";
import { getCity } from "@/lib/vela/cities";
import { cadenceLabel, formatMoney, summarize } from "@/lib/vela/engine";
import { useVela } from "@/lib/vela/store";
import { CityDesk } from "./CityDesk";
import { Compass } from "./Compass";
import { Dream } from "./Dream";
import { Horizon } from "./Horizon";
import { Ledger } from "./Ledger";
import { Pulls } from "./Pulls";
import { Rules } from "./Rules";
import { GhostButton, PrimaryButton } from "./ui";

const VIEWS = [
  ["compass", "Compass"],
  ["ledger", "Ledger"],
  ["rules", "Rules"],
  ["pulls", "Pulls"],
  ["horizon", "Horizon"],
  ["city", "City"],
  ["dream", "Dream"],
] as const;

type View = (typeof VIEWS)[number][0];

export function Studio({ onRevise, onReset }: { onRevise: () => void; onReset: () => void }) {
  const vela = useVela();
  const [view, setView] = useState<View>("compass");
  const [armed, setArmed] = useState(false);
  const now = useMemo(() => new Date(), []);
  const profile = vela.profile;
  if (!profile) return null;
  const city = getCity(profile.cityId);
  const summary = summarize(profile, vela.txs, vela.refusals, now);

  return (
    <div className="safe-bottom min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-bg">
        <div className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-display text-xl leading-none text-ink">Vela</p>
              <p className="mt-1 truncate text-xs text-muted">
                {profile.name ? `${profile.name} · ` : ""}
                {city.name} · {cadenceLabel(profile.cadence)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">Safe today</p>
              <p className={`num text-lg ${summary.safeToday <= 0 && summary.remaining < 0 ? "text-brick" : "text-ink"}`}>
                {formatMoney(summary.safeToday, profile.currency)}
              </p>
            </div>
          </div>
          <nav className="no-scrollbar -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-3" aria-label="Sections">
            {VIEWS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-current={view === id ? "page" : undefined}
                onClick={() => setView(id)}
                className={`shrink-0 rounded-md px-3 text-sm font-medium min-h-11 ${
                  view === id ? "bg-accent text-accent-fg" : "text-muted hover:bg-accent-soft hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={onRevise}
              className="shrink-0 rounded-md px-3 text-sm font-medium text-muted min-h-11 hover:bg-accent-soft hover:text-ink"
            >
              Revise
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6">
        {profile.sample ? (
          <div className="mb-4 flex flex-col gap-3 rounded-xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-muted">
              This is Meera’s month in Mumbai, so the studio is already alive. Edit any line, or start over with your own interview.
            </p>
            <GhostButton type="button" onClick={() => vela.patchProfile({ sample: false })}>
              Keep these numbers
            </GhostButton>
          </div>
        ) : null}

        {view === "compass" ? (
          <Compass profile={profile} txs={vela.txs} refusals={vela.refusals} onLedger={() => setView("ledger")} />
        ) : null}
        {view === "ledger" ? <Ledger /> : null}
        {view === "rules" ? <Rules profile={profile} txs={vela.txs} refusals={vela.refusals} /> : null}
        {view === "pulls" ? <Pulls profile={profile} txs={vela.txs} refusals={vela.refusals} /> : null}
        {view === "horizon" ? <Horizon profile={profile} txs={vela.txs} refusals={vela.refusals} /> : null}
        {view === "city" ? <CityDesk profile={profile} txs={vela.txs} refusals={vela.refusals} /> : null}
        {view === "dream" ? <Dream /> : null}

        <footer className="mt-10 border-t border-line pt-6">
          <p className="max-w-2xl text-xs leading-relaxed text-faint">
            Vela plans. It does not bank, invest, or know tomorrow’s prices. City figures are typical ranges and
            seasons. The horizon chart is an illustration with no fees and no taxes. If a pull has stopped feeling
            optional, talk to a person, not only a ledger.
          </p>
          <div className="mt-4">
            {armed ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <PrimaryButton type="button" onClick={onReset}>
                  Clear everything
                </PrimaryButton>
                <GhostButton type="button" onClick={() => setArmed(false)}>
                  Keep my plan
                </GhostButton>
              </div>
            ) : (
              <button type="button" className="min-h-11 text-sm text-muted" onClick={() => setArmed(true)}>
                Start over
              </button>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
}
