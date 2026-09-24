import { GhostButton, Panel, PrimaryButton } from "./ui";

export function Landing({
  ready,
  onStart,
  onSample,
}: {
  ready: boolean;
  onStart: () => void;
  onSample: () => void;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-16">
      <p className="text-sm font-medium tracking-wide text-accent">Vela</p>
      <h1 className="mt-4 max-w-xl text-4xl text-ink sm:text-6xl">
        A spending plan that starts with your life.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
        A short interview asks who the money is for, which city you live in, what pulls at it, and
        what the dream costs. Vela writes the rules, keeps a live balance, and tells you if the
        dream does not close — then draws another way.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <PrimaryButton className="px-5" disabled={!ready} onClick={onStart}>
          Begin the interview
        </PrimaryButton>
        <GhostButton disabled={!ready} onClick={onSample}>
          See Meera in Mumbai
        </GhostButton>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <Panel>
          <h2 className="text-xl text-ink">Rules, not a poster</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Salary, pocket money, a household of four, a tight rent city — the split changes. So
            does the payday instruction.
          </p>
        </Panel>
        <Panel>
          <h2 className="text-xl text-ink">A number you can spend</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Remaining balance is the whole pot. Safe today is what is left after the future sleeve
            is protected.
          </p>
        </Panel>
        <Panel>
          <h2 className="text-xl text-ink">City, dream, forks</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            When appliances usually get cheaper where you live, and what to do if the dream’s date
            is a wish.
          </p>
        </Panel>
      </div>
      <p className="mt-10 max-w-xl text-sm leading-relaxed text-faint">
        Vela is a planning studio on this device. It is not a bank, not a broker, and not advice.
        City figures are typical seasonal patterns, not live shop prices.
      </p>
    </main>
  );
}
