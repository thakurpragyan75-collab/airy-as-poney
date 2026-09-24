import { useMemo, useState } from "react";
import {
  INCOME_CATS,
  VAULT_CATS,
  categoriesFor,
  categoryGroup,
  dreamDelayDays,
  formatMoney,
  lifePhrase,
  summarize,
  todayISO,
  uid,
} from "@/lib/vela/engine";
import { useVela } from "@/lib/vela/store";
import type { Tx, TxKind } from "@/lib/vela/types";
import { GhostButton, Label, Panel, PrimaryButton, fieldClass } from "./ui";

type Draft = {
  id?: string;
  kind: TxKind;
  amount: string;
  category: string;
  note: string;
  date: string;
};

const empty = (): Draft => ({
  kind: "expense",
  amount: "",
  category: "Groceries",
  note: "",
  date: todayISO(),
});

export function Ledger() {
  const { profile, txs, refusals, addTx, updateTx, deleteTx, addRefusal, patchProfile } = useVela();
  const [draft, setDraft] = useState<Draft>(empty);
  const [filter, setFilter] = useState<"all" | TxKind>("all");
  const [armed, setArmed] = useState<string | null>(null);
  const [pending, setPending] = useState<Draft | null>(null);
  const now = useMemo(() => new Date(), []);

  if (!profile) return null;
  const cats = categoriesFor(profile);
  const summary = summarize(profile, txs, refusals, now);
  const c = profile.currency;

  const options =
    draft.kind === "income" ? INCOME_CATS : draft.kind === "vault" ? VAULT_CATS : cats.map((cat) => cat.name);

  const submit = (force: Draft | null = null) => {
    const source = force ?? draft;
    const amount = Number(source.amount.replace(/,/g, ""));
    if (!(amount > 0) || !source.date) return;
    const category = source.category || options[0] || "Other";
    const group = categoryGroup(category, profile);
    if (
      !force &&
      !source.id &&
      profile.quiet &&
      source.kind === "expense" &&
      (group === "joy" || group === "pull")
    ) {
      setPending({ ...source, category, amount: String(amount) });
      return;
    }
    const tx: Tx = {
      id: source.id ?? uid(),
      kind: source.kind,
      amount,
      category,
      note: source.note.trim(),
      date: source.date,
    };
    if (source.id) updateTx(tx);
    else addTx(tx);
    setDraft(empty());
    setPending(null);
  };

  const rows = txs
    .filter((tx) => (filter === "all" ? true : tx.kind === filter))
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const life = pending ? lifePhrase(Number(pending.amount), profile) : "";
  const days = pending ? dreamDelayDays(Number(pending.amount), summary.dream.surplusMonthly) : null;

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <Panel className="lg:col-span-5" >
        <h2 className="text-2xl text-ink">{draft.id ? "Edit a line" : "Add a line"}</h2>
        <p className="mt-2 text-sm text-muted">
          Income raises the balance. Spending lowers it. Vault leaves the spendable pile and fills the dream.
        </p>
        <form
          className="mt-5 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["expense", "Spend"],
                ["income", "Income"],
                ["vault", "Vault"],
              ] as const
            ).map(([kind, label]) => (
              <button
                key={kind}
                type="button"
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    kind,
                    category: kind === "income" ? "Paycheck" : kind === "vault" ? "Dream vault" : cats[0]?.name ?? "Groceries",
                  }))
                }
                className={`min-h-11 rounded-md border text-sm font-medium ${
                  draft.kind === kind ? "border-accent bg-accent text-accent-fg" : "border-line bg-bg text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <label>
            <Label>Amount</Label>
            <input
              className={`${fieldClass} num`}
              inputMode="decimal"
              value={draft.amount}
              onChange={(e) => setDraft((d) => ({ ...d, amount: e.target.value }))}
              placeholder="0"
              required
            />
          </label>
          <label>
            <Label>Category</Label>
            <select
              className={fieldClass}
              value={draft.category}
              onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
            >
              {options.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <Label>Date</Label>
            <input
              className={fieldClass}
              type="date"
              value={draft.date}
              onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
              required
            />
          </label>
          <label>
            <Label>Note</Label>
            <input
              className={fieldClass}
              maxLength={80}
              value={draft.note}
              onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
              placeholder="Optional"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <PrimaryButton type="submit">{draft.id ? "Save line" : "Add line"}</PrimaryButton>
            {draft.id ? (
              <GhostButton type="button" onClick={() => setDraft(empty())}>
                Cancel edit
              </GhostButton>
            ) : null}
          </div>
        </form>
        <button
          type="button"
          className="mt-5 text-sm text-muted"
          onClick={() => patchProfile({ quiet: !profile.quiet })}
        >
          Quiet hour is {profile.quiet ? "on" : "off"}. {profile.quiet ? "Joy and pulls will ask once." : "Lines save immediately."}
        </button>
      </Panel>

      <Panel className="lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl text-ink">Ledger</h2>
          <div className="flex gap-2">
            {(
              [
                ["all", "All"],
                ["income", "Income"],
                ["expense", "Spending"],
                ["vault", "Vault"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={`min-h-11 rounded-md px-3 text-sm ${
                  filter === id ? "bg-accent text-accent-fg" : "text-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <ul className="mt-2 divide-y divide-line">
          {rows.length ? (
            rows.map((tx) => (
              <li key={tx.id} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{tx.category}</p>
                    <p className="text-xs text-faint">
                      {tx.date}
                      {tx.note ? ` · ${tx.note}` : ""}
                      {tx.kind === "expense" ? ` · ${lifePhrase(tx.amount, profile)}` : ""}
                    </p>
                  </div>
                  <p className={`num shrink-0 text-sm ${tx.kind === "income" ? "text-accent" : "text-ink"}`}>
                    {tx.kind === "income" ? "+" : "−"}
                    {formatMoney(tx.amount, c)}
                  </p>
                </div>
                <div className="mt-1 flex gap-2">
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center justify-center rounded-md px-3 text-sm text-muted hover:bg-accent-soft hover:text-ink"
                    onClick={() => {
                      setDraft({
                        id: tx.id,
                        kind: tx.kind,
                        amount: String(tx.amount),
                        category: tx.category,
                        note: tx.note,
                        date: tx.date,
                      });
                      setArmed(null);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center justify-center rounded-md px-3 text-sm text-muted hover:bg-brick-soft hover:text-brick"
                    onClick={() => {
                      if (armed === tx.id) {
                        deleteTx(tx.id);
                        if (draft.id === tx.id) setDraft(empty());
                        setArmed(null);
                      } else setArmed(tx.id);
                    }}
                  >
                    {armed === tx.id ? "Confirm delete" : "Delete"}
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="py-6 text-sm text-muted">No lines in this filter.</li>
          )}
        </ul>
      </Panel>

      {pending ? (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quiet-title"
        >
          <div className="rise w-full max-w-lg rounded-xl bg-surface p-5">
            <p className="text-sm text-muted">Quiet hour</p>
            <h2 id="quiet-title" className="mt-2 text-3xl text-ink">
              Does this serve the dream?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {formatMoney(Number(pending.amount), c)} for {pending.category.toLowerCase()}
              {life ? ` is ${life}` : ""}.
              {days
                ? ` It asks for about ${days} days of the future sleeve.`
                : " There is no surplus yet, so this comes straight out of the plan."}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <PrimaryButton
                type="button"
                onClick={() => {
                  addRefusal({
                    id: uid(),
                    amount: Number(pending.amount),
                    category: pending.category,
                    note: pending.note || "Put back",
                    date: pending.date,
                  });
                  setPending(null);
                  setDraft(empty());
                }}
              >
                Put it back
              </PrimaryButton>
              <GhostButton
                type="button"
                onClick={() => {
                  addTx({
                    id: uid(),
                    kind: "vault",
                    amount: Number(pending.amount),
                    category: "Dream vault",
                    note: pending.note || `Instead of ${pending.category}`,
                    date: pending.date,
                  });
                  setPending(null);
                  setDraft(empty());
                }}
              >
                Send it to the dream vault
              </GhostButton>
              <GhostButton type="button" onClick={() => submit(pending)}>
                Log it anyway
              </GhostButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
