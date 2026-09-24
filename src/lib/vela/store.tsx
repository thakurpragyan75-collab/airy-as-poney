import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { sampleState } from "./engine";
import type { Profile, Refusal, Tx } from "./types";

const KEY = "vela-plan-v1";

type Data = {
  profile: Profile | null;
  txs: Tx[];
  refusals: Refusal[];
};

const EMPTY: Data = { profile: null, txs: [], refusals: [] };

type Store = Data & {
  ready: boolean;
  saveProfile: (profile: Profile) => void;
  patchProfile: (partial: Partial<Profile>) => void;
  addTx: (tx: Tx) => void;
  updateTx: (tx: Tx) => void;
  deleteTx: (id: string) => void;
  addRefusal: (refusal: Refusal) => void;
  loadSample: () => void;
  reset: () => void;
};

const Ctx = createContext<Store | null>(null);

function parse(raw: string): Data {
  try {
    const data = JSON.parse(raw) as Partial<Data> & { v?: number };
    if (!data || data.v !== 1) return EMPTY;
    return {
      profile: data.profile ?? null,
      txs: Array.isArray(data.txs) ? data.txs : [],
      refusals: Array.isArray(data.refusals) ? data.refusals : [],
    };
  } catch {
    return EMPTY;
  }
}

export function VelaProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Data>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setData(parse(raw));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify({ v: 1, ...data }));
  }, [data, ready]);

  const store = useMemo<Store>(
    () => ({
      ...data,
      ready,
      saveProfile: (profile) => setData((d) => ({ ...d, profile })),
      patchProfile: (partial) =>
        setData((d) => (d.profile ? { ...d, profile: { ...d.profile, ...partial } } : d)),
      addTx: (tx) => setData((d) => ({ ...d, txs: [tx, ...d.txs] })),
      updateTx: (tx) => setData((d) => ({ ...d, txs: d.txs.map((row) => (row.id === tx.id ? tx : row)) })),
      deleteTx: (id) => setData((d) => ({ ...d, txs: d.txs.filter((row) => row.id !== id) })),
      addRefusal: (refusal) => setData((d) => ({ ...d, refusals: [refusal, ...d.refusals] })),
      loadSample: () => {
        const sample = sampleState(new Date());
        setData({ profile: sample.profile, txs: sample.txs, refusals: sample.refusals });
      },
      reset: () => setData(EMPTY),
    }),
    [data, ready],
  );

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useVela(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Vela is not ready");
  return ctx;
}
