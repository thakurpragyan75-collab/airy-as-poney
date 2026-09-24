import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  format,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { getCity, type Appliance, type City, type Season } from "./cities";
import type {
  Bands,
  Cadence,
  Group,
  Housing,
  IncomeKind,
  LeakId,
  Profile,
  Refusal,
  Risk,
  SpecialId,
  Tx,
} from "./types";

export const LEAKS: Record<
  LeakId,
  { label: string; category: string; estimatePct: number; note: string }
> = {
  delivery: {
    label: "Food delivery",
    category: "Food delivery",
    estimatePct: 6,
    note: "The easiest pull to halve without touching real groceries.",
  },
  smoking: {
    label: "Smoking",
    category: "Smoking",
    estimatePct: 5,
    note: "A daily pull. Vela only counts the money, not the health lecture.",
  },
  alcohol: {
    label: "Alcohol",
    category: "Alcohol",
    estimatePct: 4,
    note: "Often hides inside dining. Logging it here keeps the ceiling honest.",
  },
  betting: {
    label: "Betting",
    category: "Betting",
    estimatePct: 6,
    note: "If this has stopped feeling optional, a budget is the wrong only tool.",
  },
  subscriptions: {
    label: "Forgotten subscriptions",
    category: "Subscriptions",
    estimatePct: 3,
    note: "Keep the ones you would notice missing. Cancel the rest.",
  },
  impulse: {
    label: "Impulse shopping",
    category: "Impulse shopping",
    estimatePct: 5,
    note: "Unplanned goods. Planned shopping can stay in its own line.",
  },
  gaming: {
    label: "Gaming spends",
    category: "Gaming spends",
    estimatePct: 3,
    note: "Passes and top-ups. A cap you keep beats a ban you will not.",
  },
  cafes: {
    label: "Cafes",
    category: "Cafes",
    estimatePct: 3,
    note: "A small daily number that becomes a bill by the end of the year.",
  },
};

export const LEAK_ORDER: LeakId[] = [
  "delivery",
  "cafes",
  "subscriptions",
  "impulse",
  "alcohol",
  "smoking",
  "gaming",
  "betting",
];

export const SPECIALS: Record<SpecialId, { label: string; category: string; detail: string }> = {
  parents: {
    label: "Supporting parents",
    category: "Family support",
    detail: "Treated as a need, not as whatever is left on the 28th.",
  },
  student: {
    label: "Student or tuition",
    category: "Tuition",
    detail: "Fees get a name so they do not ambush the joy band.",
  },
  medical: {
    label: "Medical costs",
    category: "Medical",
    detail: "Widens needs and the emergency sleeve.",
  },
  wedding: {
    label: "A wedding",
    category: "Wedding",
    detail: "A season with relatives attached. It needs an envelope.",
  },
  baby: {
    label: "A baby or new child",
    category: "Child costs",
    detail: "Needs rise, and the emergency sleeve gets longer.",
  },
  debt: {
    label: "Debt payments",
    category: "Debt payment",
    detail: "A need until it is gone. Not a personality.",
  },
  relocation: {
    label: "A move",
    category: "Moving",
    detail: "Deposits and boxes. Separate from new furniture moods.",
  },
  care: {
    label: "Caregiving",
    category: "Caregiving",
    detail: "Time and cash. The plan should not pretend it is optional.",
  },
};

export const SPECIAL_ORDER: SpecialId[] = [
  "parents",
  "student",
  "medical",
  "debt",
  "baby",
  "care",
  "wedding",
  "relocation",
];

const JOY_CATS = ["Dining", "Shopping", "Entertainment", "Travel", "Personal"];
const NEED_BASE = ["Housing", "Groceries", "Transit", "Utilities", "Health", "Education"];

export const INCOME_CATS = ["Paycheck", "Pocket money", "Freelance", "Gift", "Side work", "Other"];
export const VAULT_CATS = ["Emergency cash", "Dream vault", "Long horizon"];

const LOCALE: Record<string, string> = {
  INR: "en-IN",
  USD: "en-US",
  GBP: "en-GB",
  EUR: "de-DE",
  SGD: "en-SG",
  AED: "en-AE",
  JPY: "ja-JP",
  AUD: "en-AU",
  KES: "en-KE",
  NGN: "en-NG",
  CAD: "en-CA",
  MXN: "es-MX",
};

const ZERO_DEC = new Set(["JPY", "KRW", "VND"]);

export function formatMoney(amount: number, currency: string): string {
  const digits = ZERO_DEC.has(currency) ? 0 : Math.abs(amount) >= 100 ? 0 : 2;
  try {
    return new Intl.NumberFormat(LOCALE[currency] ?? "en", {
      style: "currency",
      currency,
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    }).format(Number.isFinite(amount) ? amount : 0);
  } catch {
    return `${Math.round(amount)} ${currency}`;
  }
}

export function todayISO(now = new Date()): string {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function uid(): string {
  return crypto.randomUUID();
}

export function toMonthly(amount: number, cadence: Cadence): number {
  if (cadence === "weekly") return (amount * 52) / 12;
  if (cadence === "quarterly") return amount / 3;
  if (cadence === "annual") return amount / 12;
  return amount;
}

export function fromMonthly(monthly: number, cadence: Cadence): number {
  if (cadence === "weekly") return (monthly * 12) / 52;
  if (cadence === "quarterly") return monthly * 3;
  if (cadence === "annual") return monthly * 12;
  return monthly;
}

export function cadenceLabel(c: Cadence): string {
  if (c === "weekly") return "week";
  if (c === "quarterly") return "quarter";
  if (c === "annual") return "year";
  return "month";
}

export function cadenceTitle(c: Cadence): string {
  if (c === "weekly") return "Weekly";
  if (c === "quarterly") return "Quarterly";
  if (c === "annual") return "Yearly";
  return "Monthly";
}

export type Period = {
  start: Date;
  end: Date;
  label: string;
  daysTotal: number;
  daysElapsed: number;
  daysLeft: number;
};

export function periodOf(cadence: Cadence, now = new Date()): Period {
  let start: Date;
  let end: Date;
  let label: string;
  if (cadence === "weekly") {
    start = startOfWeek(now, { weekStartsOn: 1 });
    end = endOfWeek(now, { weekStartsOn: 1 });
    label = `Week of ${format(start, "d MMM")}`;
  } else if (cadence === "quarterly") {
    start = startOfQuarter(now);
    end = endOfQuarter(now);
    label = `Q${Math.floor(now.getMonth() / 3) + 1} ${now.getFullYear()}`;
  } else if (cadence === "annual") {
    start = startOfYear(now);
    end = endOfYear(now);
    label = String(now.getFullYear());
  } else {
    start = startOfMonth(now);
    end = endOfMonth(now);
    label = format(now, "MMMM yyyy");
  }
  const daysTotal = differenceInCalendarDays(end, start) + 1;
  const daysElapsed = Math.min(daysTotal, Math.max(1, differenceInCalendarDays(now, start) + 1));
  const daysLeft = Math.max(1, daysTotal - daysElapsed + 1);
  return { start, end, label, daysTotal, daysElapsed, daysLeft };
}

export function inPeriod(iso: string, period: Period): boolean {
  const start = format(period.start, "yyyy-MM-dd");
  const end = format(period.end, "yyyy-MM-dd");
  return iso >= start && iso <= end;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function normalizeBands(needs: number, joy: number, future: number): Bands {
  let n = clamp(needs, 36, 78);
  let j = clamp(joy, 8, 40);
  let f = clamp(future, 10, 45);
  const t = n + j + f;
  n = Math.round((n / t) * 100);
  j = Math.round((j / t) * 100);
  f = 100 - n - j;
  if (f < 10) {
    const d = 10 - f;
    f = 10;
    if (j - d >= 8) j -= d;
    else n = Math.max(36, n - d);
  }
  if (j < 8) {
    n -= 8 - j;
    j = 8;
  }
  n = 100 - j - f;
  return { needs: n, joy: j, future: f };
}

export function explainBands(profile: Profile, city = getCity(profile.cityId)): {
  bands: Bands;
  reasons: string[];
} {
  let needs = profile.incomeKind === "pocket" ? 52 : 50;
  let joy = profile.incomeKind === "pocket" ? 18 : 30;
  let future = profile.incomeKind === "pocket" ? 30 : 20;
  const reasons: string[] = [];

  if (profile.incomeKind === "pocket") {
    reasons.push("Pocket money keeps joy smaller and the future larger. A small pile disappears if treats go first.");
  } else if (profile.incomeKind === "freelance" || profile.incomeKind === "business") {
    future += 4;
    joy -= 4;
    reasons.push("Freelance and business income is lumpy, so the future sleeve is thicker for quiet months.");
  } else if (profile.incomeKind === "mixed") {
    reasons.push("Mixed income uses a salary-shaped rule, with the future sleeve as the shock absorber.");
  } else {
    reasons.push("A salary can use a classic split, then bend it for the household and the city.");
  }

  if (profile.people > 1) {
    const bump = Math.min(16, (profile.people - 1) * 4);
    needs += bump;
    joy -= bump;
    reasons.push(
      `${profile.people} people widen needs. Food and a roof come before equal treats.`,
    );
  }

  if (profile.housing === "rent" && city.tightHousing) {
    needs += 6;
    joy -= 6;
    reasons.push(`Rent in ${city.name} is a tight market, so needs take more and joy gives some back.`);
  } else if (profile.housing === "own") {
    needs -= 4;
    future += 4;
    reasons.push("A home you own shifts a little out of needs into the future sleeve.");
  } else if (profile.housing === "family") {
    needs -= 8;
    future += 5;
    joy += 3;
    reasons.push("Living with family lowers the roof line. The gift is a fatter future, not a blank check for joy.");
  } else if (profile.housing === "shared") {
    needs -= 4;
    future += 4;
    reasons.push("A shared place trims housing. The saving belongs in the vault, not automatically in dinners.");
  } else if (profile.housing === "rent") {
    reasons.push("Rent is the largest need. It is paid first, on purpose.");
  }

  const heavy = profile.specials.filter((s) =>
    ["parents", "medical", "debt", "baby", "care", "student"].includes(s),
  );
  if (heavy.length) {
    const b = Math.min(12, heavy.length * 4);
    needs += b;
    joy -= Math.ceil(b * 0.7);
    future -= Math.floor(b * 0.3);
    reasons.push(
      `${heavy.map((s) => SPECIALS[s].label.toLowerCase()).join(", ")} ${heavy.length > 1 ? "are" : "is"} treated as needs, not leftovers.`,
    );
  }
  const occasion = profile.specials.filter((s) => s === "wedding" || s === "relocation");
  if (occasion.length) {
    needs += 3 * occasion.length;
    joy -= 3 * occasion.length;
    reasons.push(
      `${occasion.map((s) => SPECIALS[s].label.toLowerCase()).join(" and ")} gets a named slice so it does not disguise itself as shopping.`,
    );
  }

  return { bands: normalizeBands(needs, joy, future), reasons };
}

export type Cat = { name: string; group: Group };

export function categoriesFor(profile: Profile): Cat[] {
  const needs = [
    ...NEED_BASE,
    ...profile.specials.map((s) => SPECIALS[s].category),
  ];
  const pulls = profile.leaks.map((id) => LEAKS[id].category);
  const joy = JOY_CATS.filter((name) => !pulls.includes(name));
  const seen = new Set<string>();
  const out: Cat[] = [];
  for (const name of needs) {
    if (seen.has(name)) continue;
    seen.add(name);
    out.push({ name, group: "needs" });
  }
  for (const name of joy) out.push({ name, group: "joy" });
  for (const name of pulls) out.push({ name, group: "pull" });
  return out;
}

export function categoryGroup(name: string, profile: Profile): Group | "other" {
  return categoriesFor(profile).find((c) => c.name === name)?.group ?? "other";
}

export type PullCap = { id: LeakId; pct: number; periodAmount: number };

export function pullCaps(profile: Profile, bands: Bands): PullCap[] {
  const raw = profile.leaks.map((id) => ({ id, pct: LEAKS[id].estimatePct }));
  const sum = raw.reduce((a, b) => a + b.pct, 0);
  const scale = sum > bands.joy && sum > 0 ? bands.joy / sum : 1;
  const periodIncome = profile.incomeAmount;
  return raw.map((r) => {
    const pct = Math.round(r.pct * scale * 10) / 10;
    return { id: r.id, pct, periodAmount: (periodIncome * pct) / 100 };
  });
}

export type Envelope = {
  name: string;
  group: Group | "future";
  periodAmount: number;
  note: string;
};

export function envelopes(profile: Profile, city = getCity(profile.cityId)): Envelope[] {
  const { bands } = explainBands(profile, city);
  const income = profile.incomeAmount;
  const needsMoney = (income * bands.needs) / 100;
  const joyMoney = (income * bands.joy) / 100;
  const futureMoney = income - needsMoney - joyMoney;
  const caps = pullCaps(profile, bands);
  const pullMoney = caps.reduce((a, c) => a + c.periodAmount, 0);
  const joyFree = Math.max(0, joyMoney - pullMoney);

  const housingShare =
    profile.housing === "family" ? 0.12 : profile.housing === "shared" ? 0.28 : profile.housing === "own" ? 0.36 : 0.46;

  const specialNames = profile.specials.map((s) => SPECIALS[s].category);
  const parts: { name: string; share: number; note: string }[] = [
    { name: "Housing", share: housingShare, note: "Roof first." },
    { name: "Groceries", share: 0.24, note: "The fair basket, not restaurants." },
    { name: "Transit", share: 0.1, note: "The commute you already have." },
    { name: "Utilities", share: 0.1, note: "Power, water, data, fuel." },
    { name: "Health", share: 0.06, note: "Ordinary care, not a crisis." },
  ];
  const used = parts.reduce((a, p) => a + p.share, 0);
  const rest = Math.max(0, 1 - used);
  const tail = ["Education", ...specialNames.filter((n) => n !== "Education")];
  const each = tail.length ? rest / tail.length : 0;
  for (const name of tail) {
    parts.push({ name, share: each, note: "Named so it cannot hide." });
  }

  const out: Envelope[] = parts.map((p) => ({
    name: p.name,
    group: "needs",
    periodAmount: needsMoney * p.share,
    note: p.note,
  }));

  for (const cap of caps) {
    out.push({
      name: LEAKS[cap.id].category,
      group: "pull",
      periodAmount: cap.periodAmount,
      note: `Ceiling inside joy. ${LEAKS[cap.id].note}`,
    });
  }

  const joyNames = JOY_CATS.filter((n) => !caps.some((c) => LEAKS[c.id].category === n));
  const joyEach = joyNames.length ? joyFree / joyNames.length : 0;
  for (const name of joyNames) {
    out.push({
      name,
      group: "joy",
      periodAmount: joyEach,
      note: "Allowed. Not required.",
    });
  }

  out.push({
    name: "Vault transfer",
    group: "future",
    periodAmount: futureMoney,
    note: `Move this on payday ${profile.payday}, before joy starts.`,
  });

  return out;
}

export function workHours(kind: IncomeKind): number {
  if (kind === "pocket") return 0;
  if (kind === "freelance") return 120;
  if (kind === "business") return 170;
  if (kind === "mixed") return 150;
  return 160;
}

export function lifePhrase(amount: number, profile: Profile): string {
  const monthly = toMonthly(profile.incomeAmount, profile.cadence);
  if (monthly <= 0 || amount <= 0) return "";
  if (profile.incomeKind === "pocket") {
    const weekly = fromMonthly(monthly, "weekly");
    const share = amount / weekly;
    if (share >= 1) return `${share.toFixed(1)} weeks of pocket money`;
    return `${Math.round(share * 100)}% of a week's pocket money`;
  }
  const hourly = monthly / workHours(profile.incomeKind);
  const hours = amount / hourly;
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} minutes of work`;
  if (hours < 10) return `${hours.toFixed(1)} hours of work`;
  return `${Math.round(hours)} hours of work`;
}

export type Weather = {
  tone: "clear" | "steady" | "watch" | "storm";
  title: string;
  detail: string;
};

export function moneyWeather(opts: {
  spent: number;
  plannedSpend: number;
  elapsed: number;
  total: number;
  remaining: number;
}): Weather {
  if (opts.remaining < 0) {
    return {
      tone: "storm",
      title: "The plan is overdrawn",
      detail: "Spending and the vault have passed this period's income. Joy waits. Needs and a smaller vault are the only honest moves.",
    };
  }
  const expected = opts.plannedSpend * (opts.elapsed / Math.max(1, opts.total));
  const ratio = expected <= 0 ? 0 : opts.spent / expected;
  if (ratio < 0.85) {
    return {
      tone: "clear",
      title: "Clear",
      detail: "Spending is behind the pace the rules allow. That is room, not a prize to spend by tonight.",
    };
  }
  if (ratio < 1.12) {
    return {
      tone: "steady",
      title: "On the line",
      detail: "You are close to the pace the rules expected by today. Safe-to-spend is the number that matters, not the big balance.",
    };
  }
  if (ratio < 1.35) {
    return {
      tone: "watch",
      title: "Running warm",
      detail: "Spending is ahead of the rule. The next want should go through the quiet hour, or the vault will be what gives.",
    };
  }
  return {
    tone: "storm",
    title: "Ahead of the rule",
    detail: "This pace does not finish the period inside the plan. Pause joy and pulls until the line cools.",
  };
}

export function tideCopy(profile: Profile, now = new Date()): string {
  if (profile.cadence !== "monthly") {
    return `Payday is day ${profile.payday} of the rhythm you chose. Move the vault first, then live on what remains.`;
  }
  const payday = Math.min(28, Math.max(1, profile.payday));
  const day = now.getDate();
  const dim = endOfMonth(now).getDate();
  if (day < payday) {
    return `Payday is the ${payday}. Until then, live inside safe-today. The balance from last time is not a second income.`;
  }
  if (day <= payday + 6) {
    return `High tide. Payday was the ${payday}. Move the future sleeve now, while the balance still looks generous.`;
  }
  const next = payday;
  const daysTo = day < next ? next - day : dim - day + next;
  if (daysTo <= 7) {
    return "Low tide. The next payday is close. Joy waits. Needs, and whatever vault is still missing, come first.";
  }
  return "Mid-tide. Safe today is the number to trust. The remaining balance includes money that still belongs to the vault.";
}

export type DreamMath = {
  surplusMonthly: number;
  wishDate: string;
  ruleMonths: number;
  ruleDate: string;
  affordable: number;
  neededMonthly: number;
  gapMonthly: number;
  achievable: boolean;
  paceMonthly: number | null;
  paceDate: string | null;
  paceMonths: number | null;
};

export function dreamDelayDays(amount: number, surplusMonthly: number): number | null {
  if (surplusMonthly <= 0 || amount <= 0) return null;
  return Math.max(1, Math.round(amount / (surplusMonthly / 30.4375)));
}

export function dreamMath(
  profile: Profile,
  bands: Bands,
  vaultThisPeriod: number,
  period: Period,
  now = new Date(),
): DreamMath {
  const monthlyIncome = toMonthly(profile.incomeAmount, profile.cadence);
  const surplusMonthly = (monthlyIncome * bands.future) / 100;
  const wishDate = format(addMonths(now, profile.dreamMonths), "MMMM yyyy");
  const ruleMonths =
    surplusMonthly > 0 ? Math.ceil(profile.dreamCost / surplusMonthly) : Number.POSITIVE_INFINITY;
  const ruleDate = Number.isFinite(ruleMonths)
    ? format(addMonths(now, ruleMonths), "MMMM yyyy")
    : "Not on this surplus";
  const affordable = surplusMonthly * profile.dreamMonths;
  const neededMonthly = profile.dreamMonths > 0 ? profile.dreamCost / profile.dreamMonths : profile.dreamCost;
  const gapMonthly = Math.max(0, neededMonthly - surplusMonthly);
  const achievable = Number.isFinite(ruleMonths) && ruleMonths <= profile.dreamMonths;

  let paceMonthly: number | null = null;
  let paceDate: string | null = null;
  let paceMonths: number | null = null;
  if (period.daysElapsed >= 7 && vaultThisPeriod > 0) {
    paceMonthly = (vaultThisPeriod / period.daysElapsed) * 30.4375;
    if (paceMonthly > 0) {
      paceMonths = Math.ceil(profile.dreamCost / paceMonthly);
      paceDate = format(addMonths(now, paceMonths), "MMMM yyyy");
    }
  }

  return {
    surplusMonthly,
    wishDate,
    ruleMonths,
    ruleDate,
    affordable,
    neededMonthly,
    gapMonthly,
    achievable,
    paceMonthly,
    paceDate,
    paceMonths,
  };
}

export type Summary = {
  period: Period;
  bands: Bands;
  reasons: string[];
  plannedIncome: number;
  actualIncome: number;
  incomeBase: number;
  usingPlanned: boolean;
  expenses: number;
  vaulted: number;
  vaultAllTime: number;
  remaining: number;
  futureTarget: number;
  futureLeft: number;
  flexible: number;
  safeToday: number;
  byCategory: { name: string; amount: number; group: Group | "other" }[];
  groupSpend: Record<Group | "other", number>;
  refused: number;
  weather: Weather;
  tide: string;
  dream: DreamMath;
  hoursNote: string;
};

export function summarize(
  profile: Profile,
  txs: Tx[],
  refusals: Refusal[],
  now = new Date(),
): Summary {
  const city = getCity(profile.cityId);
  const explained = explainBands(profile, city);
  const period = periodOf(profile.cadence, now);
  const inside = txs.filter((t) => inPeriod(t.date, period));
  const actualIncome = sum(inside.filter((t) => t.kind === "income"));
  const expenses = sum(inside.filter((t) => t.kind === "expense"));
  const vaulted = sum(inside.filter((t) => t.kind === "vault"));
  const vaultAllTime = sum(txs.filter((t) => t.kind === "vault"));
  const plannedIncome = profile.incomeAmount;
  const usingPlanned = actualIncome <= 0;
  const incomeBase = usingPlanned ? plannedIncome : actualIncome;
  const remaining = incomeBase - expenses - vaulted;
  const futureTarget = (plannedIncome * explained.bands.future) / 100;
  const futureLeft = Math.max(0, futureTarget - vaulted);
  const flexible = remaining - futureLeft;
  const safeToday = Math.max(0, flexible / period.daysLeft);
  const plannedSpend = plannedIncome * ((explained.bands.needs + explained.bands.joy) / 100);

  const map = new Map<string, number>();
  for (const t of inside) {
    if (t.kind !== "expense") continue;
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  }
  const byCategory = [...map.entries()]
    .map(([name, amount]) => ({ name, amount, group: categoryGroup(name, profile) }))
    .sort((a, b) => b.amount - a.amount);

  const groupSpend: Record<Group | "other", number> = { needs: 0, joy: 0, pull: 0, other: 0 };
  for (const row of byCategory) groupSpend[row.group] += row.amount;

  const refused = refusals.filter((r) => inPeriod(r.date, period)).reduce((a, r) => a + r.amount, 0);

  return {
    period,
    bands: explained.bands,
    reasons: explained.reasons,
    plannedIncome,
    actualIncome,
    incomeBase,
    usingPlanned,
    expenses,
    vaulted,
    vaultAllTime,
    remaining,
    futureTarget,
    futureLeft,
    flexible,
    safeToday,
    byCategory,
    groupSpend,
    refused,
    weather: moneyWeather({
      spent: expenses,
      plannedSpend,
      elapsed: period.daysElapsed,
      total: period.daysTotal,
      remaining,
    }),
    tide: tideCopy(profile, now),
    dream: dreamMath(profile, explained.bands, vaulted, period, now),
    hoursNote:
      profile.incomeKind === "pocket"
        ? "Life units are shares of a week of pocket money."
        : `Life units assume ${workHours(profile.incomeKind)} working hours in a month. They are a mirror, not a wage audit.`,
  };
}

function sum(rows: { amount: number }[]): number {
  return rows.reduce((a, r) => a + r.amount, 0);
}

export type Pressure = {
  name: string;
  spent: number;
  fair: number;
  status: "hot" | "steady" | "light" | "unlogged";
  note: string;
};

export function pressures(profile: Profile, summary: Summary, city = getCity(profile.cityId)): Pressure[] {
  const scale = summary.period.daysTotal / 30.4375;
  const rows: Pressure[] = [];
  const spentOf = (name: string) => summary.byCategory.find((c) => c.name === name)?.amount ?? 0;

  const groceryFair = city.groceryFair * profile.people * scale;
  rows.push(judge("Groceries", spentOf("Groceries"), groceryFair, `A typical ${city.name} food basket for ${profile.people}.`));

  const transitFair = city.transitFair * Math.max(1, Math.round(profile.people * 0.6)) * scale;
  rows.push(judge("Transit", spentOf("Transit"), transitFair, `Typical getting-around money in ${city.name}, not ride-hail as a lifestyle.`));

  const caps = pullCaps(profile, summary.bands);
  for (const cap of caps) {
    const name = LEAKS[cap.id].category;
    rows.push(
      judge(name, spentOf(name), cap.periodAmount, `Your ceiling for this pull. ${LEAKS[cap.id].note}`),
    );
  }

  const order = { hot: 0, steady: 1, light: 2, unlogged: 3 };
  return rows.sort((a, b) => order[a.status] - order[b.status] || b.spent - a.spent);
}

function judge(name: string, spent: number, fair: number, note: string): Pressure {
  if (spent <= 0) return { name, spent, fair, status: "unlogged", note };
  const ratio = fair <= 0 ? 1 : spent / fair;
  const status = ratio > 1.15 ? "hot" : ratio < 0.85 ? "light" : "steady";
  return { name, spent, fair, status, note };
}

export type SaveMove = { title: string; detail: string; monthly: number };

export function saveMoves(profile: Profile, summary: Summary, city = getCity(profile.cityId)): SaveMove[] {
  const moves: SaveMove[] = [];
  const toMonth = (periodAmount: number) => toMonthly(periodAmount, profile.cadence);

  for (const row of pressures(profile, summary, city)) {
    if (row.status !== "hot") continue;
    const cut = (row.spent - row.fair) * 0.7;
    const monthly = Math.max(0, toMonth(cut));
    if (monthly <= 0) continue;
    const days = dreamDelayDays(monthly, summary.dream.surplusMonthly);
    moves.push({
      title: `Cool ${row.name}`,
      detail: `${row.name} is above the line Vela uses for you. Bringing most of the gap back frees about ${formatMoney(monthly, profile.currency)} a month${days ? `, roughly ${days} days on the dream` : ""}.`,
      monthly,
    });
  }

  if (!moves.length && profile.leaks.length) {
    const cap = pullCaps(profile, summary.bands)[0];
    if (cap) {
      const half = toMonthly(cap.periodAmount / 2, profile.cadence);
      moves.push({
        title: `Halve ${LEAKS[cap.id].label.toLowerCase()}`,
        detail: `No hot receipts yet. If the ceiling is real, using only half of it frees ${formatMoney(half, profile.currency)} a month. ${LEAKS[cap.id].note}`,
        monthly: half,
      });
    }
  }

  const joyOver = summary.groupSpend.joy - (summary.plannedIncome * summary.bands.joy) / 100;
  if (joyOver > 0) {
    const monthly = toMonth(joyOver);
    moves.push({
      title: "Joy is over its band",
      detail: `Bring joy back inside ${summary.bands.joy}% and the month keeps ${formatMoney(monthly, profile.currency)}. The band is not a target to hit.`,
      monthly,
    });
  }

  const nextApp = nextAppliance(city, new Date());
  if (nextApp && !nextApp.inWindow) {
    const gap = nextApp.item.fair - nextApp.item.cheap;
    moves.push({
      title: `Wait on a ${nextApp.item.item.toLowerCase()}`,
      detail: `In ${city.name}, ${nextApp.item.window.toLowerCase()} is the cheaper window, about ${nextApp.days} days out. The typical gap is ${formatMoney(gap, profile.currency)}.`,
      monthly: 0,
    });
  }

  if (summary.vaulted + 1 < summary.futureTarget) {
    moves.push({
      title: "Pay the vault on payday",
      detail: `The rule wants ${formatMoney(summary.futureTarget, profile.currency)} in the vault this ${cadenceLabel(profile.cadence)}. ${formatMoney(summary.vaulted, profile.currency)} is there. What is missing will not appear at the end of the period.`,
      monthly: toMonth(Math.max(0, summary.futureTarget - summary.vaulted)),
    });
  }

  if (!moves.length) {
    moves.push({
      title: "Hold the line",
      detail: "Nothing is running hot against the rules or the city basket. The save is simply to keep the vault transfer boring.",
      monthly: 0,
    });
  }

  return moves.slice(0, 4);
}

export function story(profile: Profile, summary: Summary, city = getCity(profile.cityId)): string[] {
  const who = profile.name.trim() || "You";
  const people =
    profile.people === 1
      ? "just you"
      : profile.moneyFor === "partner"
        ? `you and ${profile.people - 1} other${profile.people - 1 === 1 ? "" : "s"}`
        : `a household of ${profile.people}`;
  const lines = [
    `${who}, this plan is for ${people} in ${city.name}, funded by ${incomeLabel(profile.incomeKind).toLowerCase()} of ${formatMoney(profile.incomeAmount, profile.currency)} each ${cadenceLabel(profile.cadence)}.`,
    `Needs are ${summary.bands.needs}%. Joy is ${summary.bands.joy}%. The future sleeve is ${summary.bands.future}%, about ${formatMoney(summary.dream.surplusMonthly, profile.currency)} a month if you actually move it. ${summary.reasons[0] ?? ""}`,
  ];

  if (profile.leaks.length) {
    const names = profile.leaks.map((id) => LEAKS[id].label.toLowerCase()).join(", ");
    const cap = pullCaps(profile, summary.bands).reduce((a, c) => a + c.pct, 0);
    const spent = summary.groupSpend.pull;
    lines.push(
      `You named ${names}. Together they may take about ${cap.toFixed(0)}% before they are eating the dream. ${
        spent > 0
          ? `This period those lines show ${formatMoney(spent, profile.currency)}.`
          : "Nothing is logged against them yet."
      }`,
    );
  } else {
    lines.push("You named no pulls. Joy is uncapped inside its band. That is freedom, and it is also how plans fray.");
  }

  if (summary.dream.achievable) {
    lines.push(
      `${profile.dreamTitle} can close by the date you asked, ${summary.dream.wishDate}, if the future sleeve survives. The rule alone would finish near ${summary.dream.ruleDate}.`,
    );
  } else {
    lines.push(
      `${profile.dreamTitle} does not close by ${summary.dream.wishDate} on this surplus. The money date is ${summary.dream.ruleDate}. That is not a no. It is a fork: more time, a smaller version, or a side door.`,
    );
  }

  if (summary.dream.paceDate && summary.dream.paceMonths && Number.isFinite(summary.dream.ruleMonths)) {
    if (Math.abs(summary.dream.paceMonths - summary.dream.ruleMonths) >= 2) {
      lines.push(
        `The two clocks disagree. The rule says ${summary.dream.ruleDate}. Receipts in this period imply ${summary.dream.paceDate}. Believe the vault.`,
      );
    }
  } else if (summary.period.daysElapsed < 7) {
    lines.push("The period is young. Hot and cold readings sharpen after a week of receipts.");
  }

  const hot = pressures(profile, summary, city).filter((p) => p.status === "hot");
  if (hot.length) {
    lines.push(
      `Where it runs hot: ${hot.map((h) => h.name.toLowerCase()).join(", ")}. Those are the lines to touch before you hunt for a new income.`,
    );
  }

  if (profile.specialNote.trim()) {
    lines.push(`You added a note: “${profile.specialNote.trim()}” Vela cannot verify it. The plan should leave room for it anyway.`);
  }

  return lines;
}

export function incomeLabel(kind: IncomeKind): string {
  if (kind === "pocket") return "Pocket money";
  if (kind === "freelance") return "Freelance";
  if (kind === "business") return "Business";
  if (kind === "mixed") return "Mixed income";
  return "Salary";
}

export function housingLabel(h: Housing): string {
  if (h === "own") return "Owns a home";
  if (h === "family") return "Lives with family";
  if (h === "shared") return "Shares a place";
  return "Renting";
}

export type Fork = { key: string; title: string; figure: string; caption: string; detail: string };

export function forks(profile: Profile, summary: Summary): Fork[] {
  const c = profile.currency;
  const d = summary.dream;
  if (d.achievable) {
    const halfJoy = toMonthly((profile.incomeAmount * summary.bands.joy) / 100 / 2, profile.cadence);
    const fasterSurplus = d.surplusMonthly + halfJoy;
    const fasterMonths = fasterSurplus > 0 ? Math.ceil(profile.dreamCost / fasterSurplus) : d.ruleMonths;
    return [
      {
        key: "hold",
        title: "Hold the date",
        figure: d.wishDate,
        caption: "You asked for this",
        detail: `The future sleeve covers it with time to spare. The rule would finish near ${d.ruleDate}. Keep payday transfers boring and the wish date is real.`,
      },
      {
        key: "sooner",
        title: "Arrive sooner",
        figure: Number.isFinite(fasterMonths) ? format(addMonths(new Date(), fasterMonths), "MMMM yyyy") : d.ruleDate,
        caption: "If half of joy joins the vault",
        detail: `Moving half the joy band as well adds ${formatMoney(halfJoy, c)} a month. Do this only if the household agrees it is a season, not a punishment.`,
      },
      {
        key: "softer",
        title: "Same date, softer risk",
        figure: riskLabel(profile.risk),
        caption: "Keep the date, lower the drama",
        detail:
          "If the date already works, you do not need a braver portfolio. A steadier place for the dream sleeve survives a bad quarter.",
      },
    ];
  }

  return [
    {
      key: "longer",
      title: "Give it longer",
      figure: d.ruleDate,
      caption: `${Number.isFinite(d.ruleMonths) ? `${d.ruleMonths} months` : "No date"} at today's surplus`,
      detail: `Same dream, later date. You would set aside ${formatMoney(d.surplusMonthly, c)} a month and stop pretending ${d.wishDate} is a deadline.`,
    },
    {
      key: "smaller",
      title: "Make a smaller version",
      figure: formatMoney(Math.max(0, d.affordable), c),
      caption: `What ${d.wishDate} can actually hold`,
      detail: `The date stays. The dream shrinks to what the future sleeve can gather by then. A smaller version you reach beats a poster you do not.`,
    },
    {
      key: "door",
      title: "Open a side door",
      figure: formatMoney(d.gapMonthly, c),
      caption: "More money each month",
      detail: `The date and the full cost both stay only if about ${formatMoney(d.gapMonthly, c)} a month appears from somewhere else. The ideas under this are matched to the life you described.`,
    },
  ];
}

export function sideDoors(profile: Profile, gapMonthly: number): { title: string; detail: string }[] {
  const c = profile.currency;
  const reaching = gapMonthly <= 0;
  const gap = formatMoney(Math.max(0, gapMonthly), c);
  const incomeDoor = (() => {
    if (profile.incomeKind === "pocket") {
      return {
        title: reaching ? "Only if you want it sooner" : "A small earning door",
        detail: profile.specials.includes("student")
          ? reaching
            ? "The date already works. Tutoring or campus work is optional, for a sooner arrival, not for survival."
            : `Tutoring one subject or a campus job. The gap is ${gap} a month. Two steady hours a week often matters more than a new budget.`
          : reaching
            ? "Pocket money already covers the date if the vault is paid. Extra earning is a choice, not a rescue."
            : `A named chore or one skill sold twice a month. The gap is ${gap} a month. Pocket money alone was not built for a large dream.`,
      };
    }
    if (profile.incomeKind === "freelance" || profile.incomeKind === "business") {
      return {
        title: reaching ? "A rate, if you want margin" : "Price, or one more day",
        detail: reaching
          ? "You do not have to raise the rate for this dream. An 8% higher rate is how you buy a bad month without touching the vault."
          : `An 8% higher rate, or one extra billed day, is the clean door. The gap is ${gap} a month.`,
      };
    }
    if (profile.incomeKind === "mixed") {
      return {
        title: "One stream, less vague",
        detail: reaching
          ? "The date works. If you still want margin, pick one stream to raise and ignore the rest."
          : `A Saturday invoice or a single client. Target ${gap} a month, then stop adding streams.`,
      };
    }
    return {
      title: reaching ? "You can ask, you do not have to" : "One paid hour, priced honestly",
      detail: reaching
        ? "The future sleeve covers the date. A raise is for a softer life, not to make the math legal."
        : `Overtime, a side invoice, or a raise conversation with a number. The gap is ${gap} a month.`,
    };
  })();

  const homeDoor = profile.leaks.length
    ? {
        title: `Cut ${LEAKS[profile.leaks[0]].label.toLowerCase()} in half`,
        detail: `${LEAKS[profile.leaks[0]].note} If the dream is late, this is the first place to look, before a second job.`,
      }
    : profile.people > 1
      ? {
          title: "A household split",
          detail: `Say the dream out loud and ask the household which joy line pauses for a season. ${profile.people} people is a cost and also a set of hands.`,
        }
      : {
          title: "A joy season",
          detail: "Name three months where dining and shopping drop to half. Write the end date so it does not become a personality.",
        };

  const scope = {
    title: "Change the shape, not just the effort",
    detail: profile.dreamMonths > 18
      ? "A phased dream: fund the first concrete piece (the deposit, the ticket, the tool) and let the rest wait. First pieces change behavior. Whole posters do not."
      : "If the date is close, shrink the object. A nearer, smaller version you can touch is worth more than a perfect one that needs a different life.",
  };

  if (profile.specials.includes("parents")) {
    homeDoor.detail += " If siblings share the support, one clear sentence about a fair split is a money plan.";
  }

  return [incomeDoor, homeDoor, scope];
}

export function riskLabel(risk: Risk): string {
  if (risk === "steady") return "Steady";
  if (risk === "growth") return "Growth";
  return "Balanced";
}

export type Sleeve = {
  name: string;
  where: string;
  hold: string;
  monthly: number;
  target: number | null;
  note: string;
};

export function emergencyMonths(profile: Profile): number {
  let m = profile.incomeKind === "pocket" ? 1 : 3;
  if (profile.people >= 4) m += 1;
  if (profile.specials.some((s) => s === "medical" || s === "care" || s === "baby")) m += 2;
  if (profile.housing === "rent" && profile.incomeKind !== "pocket") m += 1;
  return Math.min(9, m);
}

export function vehicle(horizonMonths: number, risk: Risk): { where: string; hold: string } {
  let h = horizonMonths;
  if (risk === "steady") h = Math.round(h * 0.75);
  if (risk === "growth") h = Math.round(h * 1.15);
  if (h <= 18) {
    return {
      where: "Cash, a savings account, or short government bills",
      hold: "Until the month you will spend it. This sleeve does not belong in stocks.",
    };
  }
  if (h <= 48) {
    return {
      where: "Mostly short bonds or a conservative debt fund. At most a fifth in a broad stock index, and only if the date can slip",
      hold: "Review twice a year. Inside 18 months of spending, move it back to cash.",
    };
  }
  if (h <= 84) {
    return {
      where: "A balanced mix: about half a broad stock index, half bonds",
      hold: "Five to seven years. A bad quarter is not a reason to leave.",
    };
  }
  return {
    where: "A broad stock index, after emergency cash is full",
    hold: "Seven years or longer. The edge is staying in, not picking a winner.",
  };
}

export function sleeves(profile: Profile, summary: Summary): Sleeve[] {
  const months = emergencyMonths(profile);
  const needsMonthly = (toMonthly(profile.incomeAmount, profile.cadence) * summary.bands.needs) / 100;
  const target = needsMonthly * months;
  const filled = summary.vaultAllTime;
  const gap = Math.max(0, target - filled);
  const surplus = summary.dream.surplusMonthly;
  const monthsToFill = surplus > 0 && gap > 0 ? Math.ceil(gap / surplus) : gap > 0 ? Infinity : 0;
  const emergencyMonthly = gap > 0 ? Math.min(surplus, gap) : 0;
  const dreamHorizon = profile.dreamMonths;
  const dreamShare = dreamHorizon <= 36 ? 0.8 : dreamHorizon <= 84 ? 0.55 : 0.35;
  const futureSurplus = surplus;
  const dreamMonthly = futureSurplus * dreamShare;
  const longMonthly = Math.max(0, futureSurplus - dreamMonthly);
  const dreamVehicle = vehicle(dreamHorizon, profile.risk === "growth" && dreamHorizon < 24 ? "balanced" : profile.risk);
  const longVehicle = vehicle(120, profile.risk);

  return [
    {
      name: "Emergency",
      where: "Cash you can reach in a day",
      hold: `${months} months of needs. Refill it after you use it, before the dream gets more.`,
      monthly: emergencyMonthly,
      target,
      note:
        gap <= 0
          ? "On the receipts we can see, this sleeve is full."
          : surplus <= 0
            ? "There is no surplus yet, so this target is a number without a path."
            : `About ${formatMoney(gap, profile.currency)} still to go, near ${Number.isFinite(monthsToFill) ? `${monthsToFill} months` : "an open stretch"} if the future sleeve goes here first.`,
    },
    {
      name: "Dream",
      where: dreamVehicle.where,
      hold: dreamVehicle.hold,
      monthly: dreamMonthly,
      target: profile.dreamCost,
      note: `For “${profile.dreamTitle}”. Horizon about ${profile.dreamMonths} months. This split starts after emergency cash is full.`,
    },
    {
      name: "Long",
      where: longVehicle.where,
      hold: longVehicle.hold,
      monthly: longMonthly,
      target: null,
      note: "What remains of the future sleeve after the dream's share. Leave it alone for seven to ten years. Do not raid it for a sale.",
    },
  ];
}

export function project(monthly: number, annualRate: number, years = 10): number[] {
  const r = annualRate / 12;
  const points: number[] = [];
  let v = 0;
  for (let m = 0; m <= years * 12; m++) {
    if (m > 0) v = (r === 0 ? v : v * (1 + r)) + monthly;
    if (m % 12 === 0) points.push(Math.round(v));
  }
  return points;
}

export function rates(risk: Risk): { illustrated: number; cash: number; label: string } {
  if (risk === "steady") return { illustrated: 0.04, cash: 0.03, label: "4% illustrated, the steady setting" };
  if (risk === "growth") return { illustrated: 0.09, cash: 0.03, label: "9% illustrated, the growth setting" };
  return { illustrated: 0.07, cash: 0.03, label: "7% illustrated, the balanced setting" };
}

export type AppTiming = { item: Appliance; inWindow: boolean; days: number; nextLabel: string };

export function applianceTiming(item: Appliance, now = new Date()): AppTiming {
  const month = now.getMonth() + 1;
  const inWindow = item.months.includes(month);
  if (inWindow) {
    return { item, inWindow, days: 0, nextLabel: "You are inside the cheaper window." };
  }
  for (let i = 1; i <= 14; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    if (item.months.includes(d.getMonth() + 1)) {
      return {
        item,
        inWindow: false,
        days: differenceInCalendarDays(d, now),
        nextLabel: `${format(d, "MMMM yyyy")}`,
      };
    }
  }
  return { item, inWindow: false, days: 0, nextLabel: item.window };
}

export function nextAppliance(city: City, now = new Date()): AppTiming | null {
  if (!city.appliances.length) return null;
  const timed = city.appliances.map((item) => applianceTiming(item, now));
  timed.sort((a, b) => Number(b.inWindow) - Number(a.inWindow) || a.days - b.days);
  return timed[0] ?? null;
}

export function upcoming(city: City, now = new Date()): { when: string; season: Season }[] {
  const out: { when: string; season: Season }[] = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const month = d.getMonth() + 1;
    for (const season of city.seasons) {
      if (season.months.includes(month)) {
        out.push({ when: format(d, "MMMM"), season });
      }
    }
  }
  const seen = new Set<string>();
  return out.filter((row) => {
    const key = row.season.title + row.when;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function draftLetter(profile: Profile, bands: Bands): string {
  const title = profile.dreamTitle.trim() || "the dream";
  return `I am keeping ${bands.future}% aside so “${title}” becomes a date, not a mood. What I named as a pull does not get a free pass.`;
}

export function sayAmount(periodAmount: number, from: Cadence, to: Cadence): number {
  return fromMonthly(toMonthly(periodAmount, from), to);
}

export function sampleState(now = new Date()): { profile: Profile; txs: Tx[]; refusals: Refusal[] } {
  const city = getCity("mumbai");
  const stub: Profile = {
    name: "Meera",
    cityId: city.id,
    currency: city.currency,
    moneyFor: "family",
    people: 4,
    incomeKind: "salary",
    cadence: "monthly",
    incomeAmount: 185000,
    payday: 1,
    housing: "rent",
    leaks: ["delivery", "subscriptions", "cafes"],
    specials: ["parents"],
    specialNote: "My parents' medicine is uneven. Some months are quiet, some are not.",
    dreamTitle: "Down payment on a small home",
    dreamCost: 1800000,
    dreamMonths: 30,
    risk: "balanced",
    quiet: true,
    letter: "",
    sample: true,
    createdAt: now.toISOString(),
  };
  const explained = explainBands(stub, city);
  stub.letter = draftLetter(stub, explained.bands);

  const y = now.getFullYear();
  const m = now.getMonth();
  const day = now.getDate();
  const iso = (d: number) => format(new Date(y, m, Math.min(d, day)), "yyyy-MM-dd");
  const row = (kind: Tx["kind"], amount: number, category: string, note: string, d: number): Tx => ({
    id: uid(),
    kind,
    amount,
    category,
    note,
    date: iso(d),
  });

  const txs: Tx[] = [
    row("income", 185000, "Paycheck", "Salary", 1),
    row("expense", 52000, "Housing", "Rent", 2),
    row("expense", 28000, "Groceries", "Markets and the week", 6),
    row("expense", 5000, "Transit", "Trains and two cabs", 8),
    row("expense", 3800, "Utilities", "Power and data", 5),
    row("expense", 15000, "Family support", "Parents", 4),
    row("expense", 14000, "Food delivery", "Late nights", 12),
    row("expense", 1899, "Subscriptions", "Three I forgot", 3),
    row("expense", 2600, "Cafes", "Office-adjacent", 11),
    row("expense", 4200, "Dining", "One family dinner", 15),
    row("expense", 3100, "Shopping", "Household bits", 9),
    row("vault", 8000, "Emergency cash", "Payday move", 1),
    row("vault", 12000, "Dream vault", "Home fund", 1),
  ];

  const refusals: Refusal[] = [
    { id: uid(), amount: 900, category: "Dining", note: "A second dinner", date: iso(Math.max(1, day - 1)) },
    { id: uid(), amount: 1499, category: "Shopping", note: "A jacket that could wait", date: iso(Math.max(1, day - 2)) },
  ];

  return { profile: stub, txs, refusals };
}

export function addCalendarDays(now: Date, days: number): string {
  return format(addDays(now, days), "d MMM yyyy");
}
