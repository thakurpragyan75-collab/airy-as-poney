import { useMemo } from "react";
import { getCity } from "@/lib/vela/cities";
import { formatMoney, pressures, saveMoves, story, summarize } from "@/lib/vela/engine";
import type { Profile, Refusal, Tx } from "@/lib/vela/types";
import { Panel, Status } from "./ui";

export function Pulls({
  profile,
  txs,
  refusals,
}: {
  profile: Profile;
  txs: Tx[];
  refusals: Refusal[];
}) {
  const now = useMemo(() => new Date(), []);
  const city = getCity(profile.cityId);
  const summary = summarize(profile, txs, refusals, now);
  const lines = story(profile, summary, city);
  const rows = pressures(profile, summary, city);
  const moves = saveMoves(profile, summary, city);
  const c = profile.currency;

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <Panel className="lg:col-span-7">
        <p className="text-sm text-muted">Read from your answers and this period’s receipts</p>
        <h2 className="mt-2 text-3xl text-ink">Where it actually goes</h2>
        <div className="mt-5 grid gap-4">
          {lines.map((line) => (
            <p key={line} className="text-sm leading-relaxed text-ink">
              {line}
            </p>
          ))}
        </div>
      </Panel>
      <Panel className="lg:col-span-5">
        <h2 className="text-2xl text-ink">How to keep more</h2>
        <ul className="mt-4 grid gap-4">
          {moves.map((move) => (
            <li key={move.title}>
              <p className="text-sm font-medium text-ink">{move.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{move.detail}</p>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel className="lg:col-span-12">
        <h2 className="text-2xl text-ink">Against the city and the ceilings</h2>
        <p className="mt-2 text-sm text-muted">
          Groceries and transit use a typical {city.name} basket. Pulls use the ceilings from your interview.
          Unlogged means we cannot tell yet.
        </p>
        <ul className="mt-4 divide-y divide-line">
          {rows.map((row) => (
            <li key={row.name} className="grid gap-2 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-ink">{row.name}</p>
                  <Status status={row.status} />
                </div>
                <p className="mt-1 text-sm text-muted">{row.note}</p>
              </div>
              <p className="num text-sm text-ink">
                {row.spent > 0 ? formatMoney(row.spent, c) : "—"}
                <span className="text-faint"> / {formatMoney(row.fair, c)}</span>
              </p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
