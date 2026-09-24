import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dreamDelayDays, formatMoney, lifePhrase, pullCaps, summarize } from "@/lib/vela/engine";
import type { Profile, Refusal, Tx } from "@/lib/vela/types";
import { Panel } from "./ui";

export function Compass({
  profile,
  txs,
  refusals,
  onLedger,
}: {
  profile: Profile;
  txs: Tx[];
  refusals: Refusal[];
  onLedger: () => void;
}) {
  const now = useMemo(() => new Date(), []);
  const summary = summarize(profile, txs, refusals, now);
  const c = profile.currency;
  const income = summary.incomeBase || 1;
  const pullCeiling = pullCaps(profile, summary.bands).reduce((sum, row) => sum + row.pct, 0);
  const rows = [
    { label: "Needs", planned: summary.bands.needs, actual: (summary.groupSpend.needs / income) * 100 },
    { label: "Joy", planned: summary.bands.joy, actual: (summary.groupSpend.joy / income) * 100 },
    { label: "Pulls", planned: pullCeiling, actual: (summary.groupSpend.pull / income) * 100 },
    { label: "Future", planned: summary.bands.future, actual: (summary.vaulted / income) * 100 },
  ];
  const chart = summary.byCategory.map((row) => ({
    name: row.name.length > 16 ? `${row.name.slice(0, 15)}…` : row.name,
    full: row.name,
    amount: Math.round(row.amount),
  }));
  const keptDays = dreamDelayDays(summary.refused, summary.dream.surplusMonthly);
  const recent = [...txs].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 4);

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <Panel className="lg:col-span-7">
        <p className="text-sm text-muted">Remaining · {summary.period.label}</p>
        <p className={`num mt-2 text-4xl sm:text-5xl ${summary.remaining < 0 ? "text-brick" : "text-ink"}`}>
          {formatMoney(summary.remaining, c)}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {summary.usingPlanned ? "Using planned income" : "Using logged income"}{" "}
          {formatMoney(summary.incomeBase, c)} · spent {formatMoney(summary.expenses, c)} · vault{" "}
          {formatMoney(summary.vaulted, c)}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-md bg-bg p-3">
            <p className="text-xs text-muted">Safe today</p>
            <p className="num mt-1 text-xl text-ink">{formatMoney(summary.safeToday, c)}</p>
            <p className="mt-1 text-xs text-faint">After the future sleeve is protected</p>
          </div>
          <div className="rounded-md bg-bg p-3">
            <p className="text-xs text-muted">Days left</p>
            <p className="num mt-1 text-xl text-ink">{summary.period.daysLeft}</p>
            <p className="mt-1 text-xs text-faint">of {summary.period.daysTotal} in this period</p>
          </div>
        </div>
      </Panel>

      <Panel className="lg:col-span-5">
        <p className="text-sm text-muted">Money weather</p>
        <h2
          className={`mt-2 text-3xl ${summary.weather.tone === "storm" ? "text-brick" : "text-ink"}`}
        >
          {summary.weather.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{summary.weather.detail}</p>
        <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-ink">{summary.tide}</p>
      </Panel>

      <Panel className="lg:col-span-7">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-2xl text-ink">Spending by category</h2>
          <button type="button" className="text-sm font-medium text-accent" onClick={onLedger}>
            Ledger
          </button>
        </div>
        {chart.length ? (
          <div className="mt-4" style={{ height: Math.max(220, chart.length * 36) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} layout="vertical" margin={{ left: 8, right: 8, top: 4, bottom: 4 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={108}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-muted)", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "var(--color-accent-soft)" }}
                  formatter={(value) => formatMoney(Number(value), c)}
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as { full?: string } | undefined;
                    return row?.full ?? "";
                  }}
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-line)",
                    borderRadius: 12,
                    color: "var(--color-ink)",
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="amount" fill="var(--color-accent)" radius={[0, 6, 6, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-muted">
            No spending in this period yet. Log a paycheck, then the costs. The chart is the receipt, not a guess.
          </p>
        )}
      </Panel>

      <div className="grid gap-4 lg:col-span-5">
        <Panel>
          <h2 className="text-2xl text-ink">Two clocks</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted">The date you asked for</p>
              <p className="mt-1 text-base font-medium text-ink">{summary.dream.wishDate}</p>
            </div>
            <div>
              <p className="text-xs text-muted">The date the rule can pay</p>
              <p className="mt-1 text-base font-medium text-ink">{summary.dream.ruleDate}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {summary.dream.paceDate
              ? `Receipts imply ${summary.dream.paceDate}. When the clocks disagree, believe the vault.`
              : summary.dream.achievable
                ? "The wish and the rule can meet. Payday is what keeps them honest."
                : "The wish is earlier than the money. Dream shows the forks."}
          </p>
        </Panel>
        <Panel>
          <p className="text-sm text-muted">Kept by putting it back</p>
          <p className="num mt-2 text-3xl text-ink">{formatMoney(summary.refused, c)}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {summary.refused > 0
              ? keptDays
                ? `${keptDays} days the dream did not slip.`
                : "Counted. The future sleeve is still too thin to turn it into days."
              : "The quiet hour counts money you almost spent."}
          </p>
        </Panel>
      </div>

      <Panel className="lg:col-span-7">
        <h2 className="text-2xl text-ink">Rule drift</h2>
        <p className="mt-2 text-sm text-muted">The mark is the rule. The bar is this period.</p>
        <div className="mt-5 grid gap-4">
          {rows.map((row) => (
            <div key={row.label}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="text-ink">{row.label}</span>
                <span className="num text-muted">
                  {Math.round(row.actual)}% · rule {Math.round(row.planned)}%
                </span>
              </div>
              <div className="relative h-2 rounded-sm bg-accent-soft">
                <div
                  className="absolute inset-y-0 left-0 rounded-sm bg-accent"
                  style={{ width: `${Math.min(100, Math.max(0, row.actual))}%` }}
                />
                <div
                  className="absolute -top-1 h-4 w-px bg-ink"
                  style={{ left: `${Math.min(100, Math.max(0, row.planned))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="lg:col-span-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl text-ink">Recent lines</h2>
          <button type="button" className="text-sm font-medium text-accent" onClick={onLedger}>
            Edit
          </button>
        </div>
        <ul className="mt-4 divide-y divide-line">
          {recent.length ? (
            recent.map((tx) => (
              <li key={tx.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {tx.category || (tx.kind === "income" ? "Income" : "Vault")}
                  </p>
                  <p className="text-xs text-faint">
                    {tx.date}
                    {tx.kind === "expense" ? ` · ${lifePhrase(tx.amount, profile)}` : ""}
                  </p>
                </div>
                <p className={`num text-sm ${tx.kind === "income" ? "text-accent" : "text-ink"}`}>
                  {tx.kind === "income" ? "+" : "−"}
                  {formatMoney(tx.amount, c)}
                </p>
              </li>
            ))
          ) : (
            <li className="py-3 text-sm text-muted">The ledger is empty. Log the paycheck first.</li>
          )}
        </ul>
        <p className="mt-2 text-xs text-faint">{summary.hoursNote}</p>
      </Panel>
    </div>
  );
}
