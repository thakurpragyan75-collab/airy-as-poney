import { useMemo, useState } from "react";
import { addMonths, format } from "date-fns";
import { LEAKS, dreamDelayDays, forks, formatMoney, pullCaps, sideDoors, summarize, toMonthly } from "@/lib/vela/engine";
import { useVela } from "@/lib/vela/store";
import type { LeakId } from "@/lib/vela/types";
import { Label, Panel, fieldClass } from "./ui";

export function Dream() {
  const { profile, txs, refusals, patchProfile } = useVela();
  const now = useMemo(() => new Date(), []);
  const summary = profile ? summarize(profile, txs, refusals, now) : null;
  const [cut, setCut] = useState(50);
  const [leak, setLeak] = useState<LeakId | "joy">(profile?.leaks[0] ?? "joy");

  if (!profile || !summary) return null;
  const paths = forks(profile, summary);
  const doors = sideDoors(profile, summary.dream.gapMonthly);
  const c = profile.currency;

  const baseMonthly = (() => {
    if (leak === "joy") {
      return toMonthly((profile.incomeAmount * summary.bands.joy) / 100, profile.cadence);
    }
    const spent = summary.byCategory.find((row) => row.name === LEAKS[leak].category)?.amount ?? 0;
    if (spent > 0) return toMonthly(spent, profile.cadence);
    const cap = pullCaps(profile, summary.bands).find((row) => row.id === leak);
    return cap ? toMonthly(cap.periodAmount, profile.cadence) : 0;
  })();
  const freed = baseMonthly * (cut / 100);
  const nextSurplus = summary.dream.surplusMonthly + freed;
  const nextMonths = nextSurplus > 0 ? Math.ceil(profile.dreamCost / nextSurplus) : null;
  const kept = dreamDelayDays(summary.refused, summary.dream.surplusMonthly);

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <Panel className="lg:col-span-12">
        <p className="text-sm text-muted">{profile.dreamTitle}</p>
        <h2 className="mt-2 text-3xl text-ink">
          {summary.dream.achievable ? "The date can hold." : "The straight path does not close."}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
          {formatMoney(profile.dreamCost, c)} in {profile.dreamMonths} months needs{" "}
          {formatMoney(summary.dream.neededMonthly, c)} a month. The future sleeve is{" "}
          {formatMoney(summary.dream.surplusMonthly, c)}.
          {summary.dream.achievable
            ? " That is enough. The other paths are optional."
            : ` The gap is ${formatMoney(summary.dream.gapMonthly, c)} a month. Pick a fork instead of a mood.`}
        </p>
        {kept ? (
          <p className="mt-3 text-sm text-ink">
            Money you put back this period is worth about {kept} days you did not lose.
          </p>
        ) : null}
      </Panel>

      {paths.map((path) => (
        <Panel key={path.key} className="lg:col-span-4">
          <p className="text-sm text-muted">{path.caption}</p>
          <h3 className="mt-2 text-2xl text-ink">{path.title}</h3>
          <p className="num mt-3 text-xl text-accent">{path.figure}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{path.detail}</p>
        </Panel>
      ))}

      <Panel className="lg:col-span-7">
        <h2 className="text-2xl text-ink">Side doors</h2>
        <ul className="mt-4 grid gap-4">
          {doors.map((door) => (
            <li key={door.title}>
              <p className="text-sm font-medium text-ink">{door.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{door.detail}</p>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel className="lg:col-span-5">
        <h2 className="text-2xl text-ink">What if you cut</h2>
        <label className="mt-4 block">
          <Label>Which line</Label>
          <select
            className={fieldClass}
            value={leak}
            onChange={(e) => {
              setCut(50);
              setLeak(e.target.value as LeakId | "joy");
            }}
          >
            <option value="joy">Half-measures on joy</option>
            {profile.leaks.map((id) => (
              <option key={id} value={id}>
                {LEAKS[id].label}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-4 block">
          <Label>Cut {cut}%</Label>
          <input
            className="mt-2 w-full accent-accent"
            type="range"
            min={0}
            max={100}
            step={5}
            value={cut}
            onChange={(e) => setCut(Number(e.target.value))}
          />
        </label>
        <p className="num mt-4 text-2xl text-ink">{formatMoney(freed, c)}</p>
        <p className="mt-1 text-sm text-muted">a month, back in the sleeve</p>
        <p className="mt-3 text-sm leading-relaxed text-ink">
          {nextMonths
            ? `The dream lands near ${format(addMonths(now, nextMonths), "MMMM yyyy")}.`
            : "Still no surplus. The cut is not enough on its own."}
        </p>
      </Panel>

      <Panel className="lg:col-span-12">
        <h2 className="text-2xl text-ink">A line from you</h2>
        <p className="mt-2 text-sm text-muted">Written when the rule was made. Change it if it does not sound like you.</p>
        <textarea
          className={`${fieldClass} mt-4 min-h-28 py-3`}
          maxLength={320}
          value={profile.letter}
          onChange={(e) => patchProfile({ letter: e.target.value })}
        />
      </Panel>
    </div>
  );
}
