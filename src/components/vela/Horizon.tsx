import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  emergencyMonths,
  formatMoney,
  project,
  rates,
  sleeves,
  summarize,
} from "@/lib/vela/engine";
import type { Profile, Refusal, Tx } from "@/lib/vela/types";
import { Panel } from "./ui";

export function Horizon({
  profile,
  txs,
  refusals,
}: {
  profile: Profile;
  txs: Tx[];
  refusals: Refusal[];
}) {
  const now = useMemo(() => new Date(), []);
  const summary = summarize(profile, txs, refusals, now);
  const plans = sleeves(profile, summary);
  const rate = rates(profile.risk);
  const c = profile.currency;
  const monthly = summary.dream.surplusMonthly;
  const chart = project(monthly, rate.illustrated).map((invested, year) => ({
    year: `${year}y`,
    invested,
    cash: project(monthly, rate.cash)[year],
  }));
  const parked = [
    ["Emergency cash", txs.filter((t) => t.kind === "vault" && t.category === "Emergency cash")],
    ["Dream vault", txs.filter((t) => t.kind === "vault" && t.category === "Dream vault")],
    ["Long horizon", txs.filter((t) => t.kind === "vault" && t.category === "Long horizon")],
  ] as const;

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <Panel className="lg:col-span-12">
        <p className="text-sm text-muted">Educational model · not advice, not a product, not a forecast</p>
        <h2 className="mt-2 text-3xl text-ink">Where the saved money waits, and for how long</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
          Emergency cash comes first, about {emergencyMonths(profile)} months of needs. The dream sleeve matches
          the date you named. Only what can sit for years belongs in a market. Illustrated path uses {rate.label}.
          Cash uses 3%. No fees, no taxes, no bad years except the gap between the two lines.
        </p>
      </Panel>
      {plans.map((sleeve) => (
        <Panel key={sleeve.name} className="lg:col-span-4">
          <p className="text-sm text-muted">{sleeve.name}</p>
          <p className="num mt-2 text-2xl text-ink">
            {formatMoney(sleeve.monthly, c)}
            <span className="text-sm font-normal text-faint"> / month</span>
          </p>
          {sleeve.target != null ? (
            <p className="mt-1 text-sm text-muted">Target {formatMoney(sleeve.target, c)}</p>
          ) : (
            <p className="mt-1 text-sm text-muted">No finish line. That is the point.</p>
          )}
          <p className="mt-4 text-sm font-medium text-ink">{sleeve.where}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{sleeve.hold}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{sleeve.note}</p>
        </Panel>
      ))}
      <Panel className="lg:col-span-7">
        <h2 className="text-2xl text-ink">If the future sleeve keeps going</h2>
        {monthly > 0 ? (
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-line)" vertical={false} />
                <XAxis dataKey="year" tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  formatter={(value, name) => [
                    formatMoney(Number(value), c),
                    name === "cash" ? "Cash at 3%" : "Illustrated",
                  ]}
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-line)",
                    borderRadius: 12,
                    color: "var(--color-ink)",
                    fontSize: 13,
                  }}
                />
                <Line type="monotone" dataKey="invested" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="cash" stroke="var(--color-faint)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">The drawing starts when the future sleeve is above zero.</p>
        )}
        <p className="mt-3 text-xs leading-relaxed text-faint">
          Pine line is the illustrated rate. Grey line is cash. A real year can land under both. Do not move the
          emergency sleeve because one month looked clever.
        </p>
      </Panel>
      <Panel className="lg:col-span-5">
        <h2 className="text-2xl text-ink">Already parked</h2>
        <ul className="mt-4 divide-y divide-line">
          {parked.map(([name, rows]) => {
            const amount = rows.reduce((a, row) => a + row.amount, 0);
            return (
              <li key={name} className="flex items-center justify-between py-3">
                <span className="text-sm text-ink">{name}</span>
                <span className="num text-sm">{formatMoney(amount, c)}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Log vault lines on payday. The three names are the three sleeves. Mixing them in one account is how
          the dream gets spent by accident.
        </p>
      </Panel>
    </div>
  );
}
