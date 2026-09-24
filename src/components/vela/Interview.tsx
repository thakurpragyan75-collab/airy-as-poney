import { useMemo, useState } from "react";
import { getCity, searchCities } from "@/lib/vela/cities";
import {
  LEAKS,
  LEAK_ORDER,
  SPECIALS,
  SPECIAL_ORDER,
  cadenceTitle,
  draftLetter,
  explainBands,
  formatMoney,
  incomeLabel,
} from "@/lib/vela/engine";
import type {
  Cadence,
  Housing,
  IncomeKind,
  LeakId,
  MoneyFor,
  Profile,
  Risk,
  SpecialId,
} from "@/lib/vela/types";
import { Choice, GhostButton, Label, Panel, PrimaryButton, fieldClass } from "./ui";

type Draft = {
  name: string;
  cityId: string;
  currency: string;
  moneyFor: MoneyFor | "";
  people: number;
  incomeKind: IncomeKind | "";
  cadence: Cadence | "";
  incomeAmount: string;
  payday: number;
  housing: Housing | "";
  leaks: LeakId[];
  noLeaks: boolean;
  specials: SpecialId[];
  noSpecials: boolean;
  specialNote: string;
  dreamTitle: string;
  dreamCost: string;
  dreamMonths: string;
  risk: Risk | "";
};

const STEPS = 11;

function parseNum(value: string): number {
  const n = Number(value.replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : NaN;
}

function fromProfile(profile: Profile | null): Draft {
  if (!profile) {
    return {
      name: "",
      cityId: "",
      currency: "USD",
      moneyFor: "",
      people: 1,
      incomeKind: "",
      cadence: "",
      incomeAmount: "",
      payday: 1,
      housing: "",
      leaks: [],
      noLeaks: false,
      specials: [],
      noSpecials: false,
      specialNote: "",
      dreamTitle: "",
      dreamCost: "",
      dreamMonths: "24",
      risk: "",
    };
  }
  return {
    name: profile.name,
    cityId: profile.cityId,
    currency: profile.currency,
    moneyFor: profile.moneyFor,
    people: profile.people,
    incomeKind: profile.incomeKind,
    cadence: profile.cadence,
    incomeAmount: String(profile.incomeAmount),
    payday: profile.payday,
    housing: profile.housing,
    leaks: profile.leaks,
    noLeaks: profile.leaks.length === 0,
    specials: profile.specials,
    noSpecials: profile.specials.length === 0,
    specialNote: profile.specialNote,
    dreamTitle: profile.dreamTitle,
    dreamCost: String(profile.dreamCost),
    dreamMonths: String(profile.dreamMonths),
    risk: profile.risk,
  };
}

export function Interview({
  initial,
  onBack,
  onDone,
}: {
  initial: Profile | null;
  onBack: () => void;
  onDone: (profile: Profile) => void;
}) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(() => fromProfile(initial));
  const [query, setQuery] = useState("");
  const cities = useMemo(() => searchCities(query).slice(0, 8), [query]);
  const city = draft.cityId ? getCity(draft.cityId) : null;

  const patch = (partial: Partial<Draft>) => setDraft((d) => ({ ...d, ...partial }));

  const amount = parseNum(draft.incomeAmount);
  const dreamCost = parseNum(draft.dreamCost);
  const dreamMonths = parseNum(draft.dreamMonths);

  const can = (() => {
    if (step === 0) return true;
    if (step === 1) return Boolean(draft.cityId);
    if (step === 2) return Boolean(draft.moneyFor);
    if (step === 3) return Boolean(draft.incomeKind);
    if (step === 4) return Boolean(draft.cadence) && amount > 0;
    if (step === 5) return Boolean(draft.housing);
    if (step === 6) return draft.noLeaks || draft.leaks.length > 0;
    if (step === 7) return draft.noSpecials || draft.specials.length > 0;
    if (step === 8) return draft.dreamTitle.trim().length > 1 && dreamCost > 0 && dreamMonths >= 1 && dreamMonths <= 360;
    if (step === 9) return Boolean(draft.risk);
    return true;
  })();

  const preview = useMemo(() => {
    if (!draft.cityId || !draft.moneyFor || !draft.incomeKind || !draft.cadence || !draft.housing || !draft.risk) {
      return null;
    }
    if (!(amount > 0) || !(dreamCost > 0)) return null;
    const profile: Profile = {
      name: draft.name.trim(),
      cityId: draft.cityId,
      currency: draft.currency,
      moneyFor: draft.moneyFor,
      people: draft.moneyFor === "self" ? 1 : Math.min(12, Math.max(2, draft.people)),
      incomeKind: draft.incomeKind,
      cadence: draft.cadence,
      incomeAmount: amount,
      payday: draft.payday,
      housing: draft.housing,
      leaks: draft.noLeaks ? [] : draft.leaks,
      specials: draft.noSpecials ? [] : draft.specials,
      specialNote: draft.specialNote.trim(),
      dreamTitle: draft.dreamTitle.trim(),
      dreamCost,
      dreamMonths: Math.round(dreamMonths),
      risk: draft.risk,
      quiet: initial?.quiet ?? true,
      letter: "",
      sample: false,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    };
    const explained = explainBands(profile);
    profile.letter = initial?.letter?.trim() ? initial.letter : draftLetter(profile, explained.bands);
    return { profile, ...explained };
  }, [amount, draft, dreamCost, dreamMonths, initial]);

  const finish = () => {
    if (!preview) return;
    onDone(preview.profile);
  };

  return (
    <main className="mx-auto w-full max-w-xl px-5 py-8 sm:py-12">
      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-accent">Vela</p>
        <p className="num text-sm text-faint">
          {step + 1} of {STEPS}
        </p>
      </div>
      <div className="mb-8 h-1 overflow-hidden rounded-sm bg-line">
        <div className="h-full bg-accent" style={{ width: `${((step + 1) / STEPS) * 100}%` }} />
      </div>

      {step === 0 ? (
        <section className="rise">
          <h1 className="text-4xl text-ink">What should the plan call you?</h1>
          <p className="mt-3 text-muted">A name makes the letter at the end sound like you. Blank is fine.</p>
          <label className="mt-8 block">
            <Label>Name</Label>
            <input
              className={fieldClass}
              value={draft.name}
              maxLength={40}
              autoComplete="name"
              onChange={(e) => patch({ name: e.target.value })}
              placeholder="Your name"
            />
          </label>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="rise">
          <h1 className="text-4xl text-ink">Where do you live?</h1>
          <p className="mt-3 text-muted">
            The city sets the currency, a fair food basket, and the months appliances usually get cheaper.
          </p>
          <label className="mt-8 block">
            <Label>Search</Label>
            <input
              className={fieldClass}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Mumbai, Lagos, Tokyo…"
            />
          </label>
          <div className="mt-3 grid gap-2">
            {cities.map((item) => (
              <Choice
                key={item.id}
                selected={draft.cityId === item.id}
                title={`${item.name}, ${item.country}`}
                detail={`${item.currency}${item.tightHousing ? " · tight housing" : ""}`}
                onClick={() => patch({ cityId: item.id, currency: item.currency })}
              />
            ))}
            {!cities.length ? <p className="text-sm text-muted">No city by that name in this atlas yet.</p> : null}
          </div>
          {city ? <p className="mt-4 text-sm leading-relaxed text-muted">{city.blurb}</p> : null}
          {initial && city && initial.currency !== city.currency ? (
            <p className="mt-3 text-sm text-brick">
              Currency becomes {city.currency}. Existing numbers are not converted.
            </p>
          ) : null}
        </section>
      ) : null}

      {step === 2 ? (
        <section className="rise">
          <h1 className="text-4xl text-ink">Who is this money for?</h1>
          <p className="mt-3 text-muted">Needs widen with people. Joy does not get a vote for every extra seat.</p>
          <div className="mt-8 grid gap-2">
            <Choice
              selected={draft.moneyFor === "self"}
              title="Just me"
              detail="One seat. The whole joy band is yours, and so is the discipline."
              onClick={() => patch({ moneyFor: "self", people: 1 })}
            />
            <Choice
              selected={draft.moneyFor === "partner"}
              title="Me and a partner"
              detail="Two or more people on one plan."
              onClick={() => patch({ moneyFor: "partner", people: Math.max(2, draft.people) })}
            />
            <Choice
              selected={draft.moneyFor === "family"}
              title="A household with family"
              detail="Children, parents at home, or anyone the money already feeds."
              onClick={() => patch({ moneyFor: "family", people: Math.max(2, draft.people || 3) })}
            />
          </div>
          {draft.moneyFor && draft.moneyFor !== "self" ? (
            <div className="mt-6">
              <Label>How many people does it cover, including you?</Label>
              <div className="flex items-center gap-3">
                <GhostButton
                  type="button"
                  className="size-11 px-0"
                  onClick={() => patch({ people: Math.max(2, draft.people - 1) })}
                  aria-label="Fewer people"
                >
                  −
                </GhostButton>
                <span className="num min-w-8 text-center text-2xl">{draft.people}</span>
                <GhostButton
                  type="button"
                  className="size-11 px-0"
                  onClick={() => patch({ people: Math.min(12, draft.people + 1) })}
                  aria-label="More people"
                >
                  +
                </GhostButton>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {step === 3 ? (
        <section className="rise">
          <h1 className="text-4xl text-ink">Where does the money come from?</h1>
          <p className="mt-3 text-muted">Pocket money and a salary should not share the same rule.</p>
          <div className="mt-8 grid gap-2">
            {(
              [
                ["salary", "Salary", "A regular paycheck. The classic split, then bent for your life."],
                ["pocket", "Pocket money", "An allowance or a small pile. Joy stays narrow so the pile lasts."],
                ["freelance", "Freelance", "Lumpy months. The future sleeve gets thicker on purpose."],
                ["business", "A business", "Same idea as freelance: quiet months need a reserve."],
                ["mixed", "Mixed", "A job plus something else. One plan, one currency."],
              ] as const
            ).map(([id, title, detail]) => (
              <Choice
                key={id}
                selected={draft.incomeKind === id}
                title={title}
                detail={detail}
                onClick={() =>
                  patch({
                    incomeKind: id,
                    cadence: draft.cadence || (id === "pocket" ? "weekly" : "monthly"),
                  })
                }
              />
            ))}
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className="rise">
          <h1 className="text-4xl text-ink">What rhythm is the money on?</h1>
          <p className="mt-3 text-muted">
            Enter the amount in that rhythm. Vela can restate it as a week, a month, a quarter, or a year later.
          </p>
          <div className="mt-8 grid gap-2">
            {(
              [
                ["weekly", "Every week"],
                ["monthly", "Every month"],
                ["quarterly", "Every quarter"],
                ["annual", "Once a year"],
              ] as const
            ).map(([id, title]) => (
              <Choice
                key={id}
                selected={draft.cadence === id}
                title={title}
                onClick={() => patch({ cadence: id })}
              />
            ))}
          </div>
          <label className="mt-6 block">
            <Label>Amount in {draft.currency}</Label>
            <input
              className={`${fieldClass} num`}
              inputMode="decimal"
              value={draft.incomeAmount}
              onChange={(e) => patch({ incomeAmount: e.target.value })}
              placeholder="0"
            />
          </label>
          <label className="mt-4 block">
            <Label>Payday, day of the period (1–28)</Label>
            <input
              className={`${fieldClass} num`}
              inputMode="numeric"
              value={String(draft.payday)}
              onChange={(e) => {
                const n = Math.round(parseNum(e.target.value));
                patch({ payday: Number.isFinite(n) ? Math.min(28, Math.max(1, n)) : 1 });
              }}
            />
          </label>
        </section>
      ) : null}

      {step === 5 ? (
        <section className="rise">
          <h1 className="text-4xl text-ink">What does housing look like?</h1>
          <div className="mt-8 grid gap-2">
            <Choice selected={draft.housing === "rent"} title="Renting" detail="The roof is the first envelope." onClick={() => patch({ housing: "rent" })} />
            <Choice selected={draft.housing === "own"} title="Paying for a home I own" detail="Needs ease a little. The future sleeve grows." onClick={() => patch({ housing: "own" })} />
            <Choice selected={draft.housing === "family"} title="Living with family" detail="A lower roof line. Do not spend the whole gift." onClick={() => patch({ housing: "family" })} />
            <Choice selected={draft.housing === "shared"} title="Sharing a place" detail="Split rent. The saving is for the vault." onClick={() => patch({ housing: "shared" })} />
          </div>
        </section>
      ) : null}

      {step === 6 ? (
        <section className="rise">
          <h1 className="text-4xl text-ink">What pulls money without asking?</h1>
          <p className="mt-3 text-muted">
            These are ceilings inside joy, not a verdict. Pick any that are true. If betting has stopped feeling optional, a person who handles that is a better next step than a tighter app.
          </p>
          <div className="mt-8 grid gap-2">
            <Choice
              selected={draft.noLeaks}
              title="None of these"
              detail="Joy stays inside its band with no extra ceiling."
              onClick={() => patch({ noLeaks: true, leaks: [] })}
            />
            {LEAK_ORDER.map((id) => (
              <Choice
                key={id}
                selected={draft.leaks.includes(id)}
                title={LEAKS[id].label}
                detail={LEAKS[id].note}
                onClick={() => {
                  const has = draft.leaks.includes(id);
                  patch({
                    noLeaks: false,
                    leaks: has ? draft.leaks.filter((x) => x !== id) : [...draft.leaks, id],
                  });
                }}
              />
            ))}
          </div>
        </section>
      ) : null}

      {step === 7 ? (
        <section className="rise">
          <h1 className="text-4xl text-ink">Is there a special claim on the money?</h1>
          <p className="mt-3 text-muted">Named claims stop hiding inside shopping.</p>
          <div className="mt-8 grid gap-2">
            <Choice
              selected={draft.noSpecials}
              title="Nothing like that"
              onClick={() => patch({ noSpecials: true, specials: [] })}
            />
            {SPECIAL_ORDER.map((id) => (
              <Choice
                key={id}
                selected={draft.specials.includes(id)}
                title={SPECIALS[id].label}
                detail={SPECIALS[id].detail}
                onClick={() => {
                  const has = draft.specials.includes(id);
                  patch({
                    noSpecials: false,
                    specials: has ? draft.specials.filter((x) => x !== id) : [...draft.specials, id],
                  });
                }}
              />
            ))}
          </div>
          <label className="mt-6 block">
            <Label>Anything else the plan should know</Label>
            <textarea
              className={`${fieldClass} min-h-24 py-3`}
              maxLength={280}
              value={draft.specialNote}
              onChange={(e) => patch({ specialNote: e.target.value })}
              placeholder="A season, a person, a cost that does not fit the list"
            />
          </label>
        </section>
      ) : null}

      {step === 8 ? (
        <section className="rise">
          <h1 className="text-4xl text-ink">What is the dream?</h1>
          <p className="mt-3 text-muted">
            A cost and a date. If the date is impossible on this income, Vela will not pretend. It will show a longer path, a smaller version, and a side door.
          </p>
          <label className="mt-8 block">
            <Label>Name it</Label>
            <input
              className={fieldClass}
              maxLength={80}
              value={draft.dreamTitle}
              onChange={(e) => patch({ dreamTitle: e.target.value })}
              placeholder="A small home, a year of school, a trip"
            />
          </label>
          <label className="mt-4 block">
            <Label>What does it cost, in {draft.currency}?</Label>
            <input
              className={`${fieldClass} num`}
              inputMode="decimal"
              value={draft.dreamCost}
              onChange={(e) => patch({ dreamCost: e.target.value })}
              placeholder="0"
            />
          </label>
          <label className="mt-4 block">
            <Label>In how many months do you want it?</Label>
            <input
              className={`${fieldClass} num`}
              inputMode="numeric"
              value={draft.dreamMonths}
              onChange={(e) => patch({ dreamMonths: e.target.value })}
            />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {[6, 12, 24, 36, 60].map((m) => (
              <GhostButton key={m} type="button" onClick={() => patch({ dreamMonths: String(m) })}>
                {m} months
              </GhostButton>
            ))}
          </div>
        </section>
      ) : null}

      {step === 9 ? (
        <section className="rise">
          <h1 className="text-4xl text-ink">How should the future money wait?</h1>
          <p className="mt-3 text-muted">
            This chooses an illustration, not a product. Near dreams stay in cash either way.
          </p>
          <div className="mt-8 grid gap-2">
            <Choice
              selected={draft.risk === "steady"}
              title="Steady"
              detail="Sleep matters more than a higher drawing. Safer places, shorter horizons."
              onClick={() => patch({ risk: "steady" })}
            />
            <Choice
              selected={draft.risk === "balanced"}
              title="Balanced"
              detail="Cash for what is soon. A broad mix only for what can wait years."
              onClick={() => patch({ risk: "balanced" })}
            />
            <Choice
              selected={draft.risk === "growth"}
              title="Growth"
              detail="You can watch a drop and not touch the long sleeve. The dream sleeve still will not gamble."
              onClick={() => patch({ risk: "growth" })}
            />
          </div>
        </section>
      ) : null}

      {step === 10 && preview ? (
        <section className="rise">
          <h1 className="text-4xl text-ink">This is the rule.</h1>
          <p className="mt-3 text-muted">
            Not a poster from the internet. Written from {incomeLabel(preview.profile.incomeKind).toLowerCase()}
            {city ? ` in ${city.name}` : ""}.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {(
              [
                ["Needs", preview.bands.needs],
                ["Joy", preview.bands.joy],
                ["Future", preview.bands.future],
              ] as const
            ).map(([label, value]) => (
              <Panel key={label} className="p-3">
                <p className="text-xs text-muted">{label}</p>
                <p className="num mt-1 text-2xl text-ink">{value}%</p>
              </Panel>
            ))}
          </div>
          <ul className="mt-6 grid gap-3">
            {preview.reasons.map((reason) => (
              <li key={reason} className="text-sm leading-relaxed text-muted">
                {reason}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-ink">
            Each {preview.profile.cadence === "weekly" ? "week" : preview.profile.cadence === "annual" ? "year" : preview.profile.cadence === "quarterly" ? "quarter" : "month"}:{" "}
            {formatMoney(preview.profile.incomeAmount, preview.profile.currency)}. On day {preview.profile.payday}, move the future slice before joy starts.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">{preview.profile.letter}</p>
        </section>
      ) : null}

      <div className="mt-10 flex items-center justify-between gap-3">
        <GhostButton type="button" onClick={() => (step === 0 ? onBack() : setStep((s) => s - 1))}>
          Back
        </GhostButton>
        {step < 10 ? (
          <PrimaryButton type="button" disabled={!can} onClick={() => setStep((s) => s + 1)}>
            Continue
          </PrimaryButton>
        ) : (
          <PrimaryButton type="button" disabled={!preview} onClick={finish}>
            Enter the studio
          </PrimaryButton>
        )}
      </div>
      <p className="mt-6 text-xs text-faint">{cadenceTitle(draft.cadence || "monthly")} plan · kept on this device</p>
    </main>
  );
}
