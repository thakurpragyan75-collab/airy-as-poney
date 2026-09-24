export type Cadence = "weekly" | "monthly" | "quarterly" | "annual";
export type IncomeKind = "salary" | "pocket" | "freelance" | "business" | "mixed";
export type MoneyFor = "self" | "partner" | "family";
export type Housing = "rent" | "own" | "family" | "shared";
export type Risk = "steady" | "balanced" | "growth";

export type LeakId =
  | "delivery"
  | "smoking"
  | "alcohol"
  | "betting"
  | "subscriptions"
  | "impulse"
  | "gaming"
  | "cafes";

export type SpecialId =
  | "parents"
  | "student"
  | "medical"
  | "wedding"
  | "baby"
  | "debt"
  | "relocation"
  | "care";

export type Profile = {
  name: string;
  cityId: string;
  currency: string;
  moneyFor: MoneyFor;
  people: number;
  incomeKind: IncomeKind;
  cadence: Cadence;
  incomeAmount: number;
  payday: number;
  housing: Housing;
  leaks: LeakId[];
  specials: SpecialId[];
  specialNote: string;
  dreamTitle: string;
  dreamCost: number;
  dreamMonths: number;
  risk: Risk;
  quiet: boolean;
  letter: string;
  sample: boolean;
  createdAt: string;
};

export type TxKind = "income" | "expense" | "vault";

export type Tx = {
  id: string;
  kind: TxKind;
  amount: number;
  category: string;
  note: string;
  date: string;
};

export type Refusal = {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string;
};

export type Group = "needs" | "joy" | "pull";

export type Bands = {
  needs: number;
  joy: number;
  future: number;
};
