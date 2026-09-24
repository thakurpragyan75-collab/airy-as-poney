import { useMemo, useState } from "react";
import { getCity } from "@/lib/vela/cities";
import {
  cadenceLabel,
  cadenceTitle,
  envelopes,
  explainBands,
  formatMoney,
  housingLabel,
  incomeLabel,
  sayAmount,
  summarize,
} from "@/lib/vela/engine";
import type { Cadence, Profile, Refusal, Tx } from "@/lib/vela/types";
import { Panel } from "./ui";

const SAYS: Cadence[] = ["weekly", "monthly", "quarterly", "annual"];

export function Rules({
  profile,
  txs,
  refusals,
}: {
  profile: Profile;
  txs: Tx[];
  refusals: Refusal[];
}) {
  const [say, setSay] = useState<Cadence>(profile.cadence);
  const now = useMemo(() => new Date(), []);
  const city = getCity(profile.cityId);
  const explained = explainBands(profile, city);
  const rows = envelopes(profile, city);
  const summary = summarize(profile, txs, refusals, now);
  const c = profile.currency;
  const show = (periodAmount: number) => formatMoney(sayAmount(periodAmount, profile.cadence, say), c);

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <Panel className="lg:col-span-7">
        <p className="text-sm text-muted">
          {incomeLabel(profile.incomeKind)} · {housingLabel(profile.housing)} · {city.name}
        </p>
        <h2 className="mt-2 text-3xl text-ink">Where this money goes</h2>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {(
            [
              ["Needs", explained.bands.needs],
              ["Joy", explained.bands.joy],
              ["Future", explained.bands.future],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="rounded-md bg-bg p-3">
              <p className="text-xs text-muted">{label}</p>
              <p className="num mt-1 text-2xl">{value}%</p>
            </div>
          ))}
        </div>
        <ul className="mt-5 grid gap-3">
          {explained.reasons.map((reason) => (
            <li key={reason} className="text-sm leading-relaxed text-muted">
              {reason}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm leading-relaxed text-ink">
          On day {profile.payday}, move {show(rows.find((r) => r.group === "future")?.periodAmount ?? 0)} into the
          vault before joy starts. That is the whole trick.
        </p>
      </Panel>

      <Panel className="lg:col-span-5">
        <h2 className="text-2xl text-ink">Say it in</h2>
        <p className="mt-2 text-sm text-muted">
          Same plan, four rhythms. Your ledger stays on the {cadenceLabel(profile.cadence)}.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {SAYS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSay(item)}
              className={`min-h-11 rounded-md border text-sm font-medium ${
                say === item ? "border-accent bg-accent text-accent-fg" : "border-line bg-bg text-ink"
              }`}
            >
              {cadenceTitle(item)}
            </button>
          ))}
        </div>
        <p className="num mt-5 text-3xl text-ink">{show(profile.incomeAmount)}</p>
        <p className="mt-1 text-sm text-muted">Income, said as a {cadenceLabel(say)}</p>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          This period’s remaining balance is {formatMoney(summary.remaining, c)}. Safe today is{" "}
          {formatMoney(summary.safeToday, c)}.
        </p>
      </Panel>

      <Panel className="lg:col-span-12">
        <h2 className="text-2xl text-ink">Envelopes</h2>
        <p className="mt-2 text-sm text-muted">
          Pulls sit inside joy as ceilings. Hitting a ceiling means that pull stops, even if joy still has room.
        </p>
        <ul className="mt-4 divide-y divide-line">
          {rows.map((row) => (
            <li key={row.name} className="grid gap-1 py-3 sm:grid-cols-[1fr_auto] sm:items-baseline">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">
                  {row.name}
                  <span className="ml-2 text-xs font-normal text-faint">
                    {row.group === "future" ? "Future" : row.group === "pull" ? "Pull" : row.group === "joy" ? "Joy" : "Need"}
                  </span>
                </p>
                <p className="text-sm text-muted">{row.note}</p>
              </div>
              <p className="num text-base text-ink">{show(row.periodAmount)}</p>
            </li>
          ))}
        </ul>
      </Panel>

      {profile.people > 1 ? (
        <Panel className="lg:col-span-12">
          <h2 className="text-2xl text-ink">Seats</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Needs split across {profile.people} people, about{" "}
            {show((profile.incomeAmount * explained.bands.needs) / 100 / profile.people)} a seat each{" "}
            {cadenceLabel(say)}. Joy is not a promise of equal treats. It is what remains after needs and the vault.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Array.from({ length: profile.people }, (_, i) => (
              <div key={i} className="rounded-md bg-bg p-3">
                <p className="text-xs text-muted">{i === 0 ? "You" : `Seat ${i + 1}`}</p>
                <p className="num mt-1 text-lg">{show((profile.incomeAmount * explained.bands.needs) / 100 / profile.people)}</p>
              </div>
            ))}
          </div>
        </Panel>
      ) : null}
    </div>
  );
}
