# Vela

Vela is a spending studio. It does not start with a pie chart. It starts with who the money is for, where you live, what keeps pulling at the cash, and what you are actually trying to reach. From that interview it writes a spending rule, keeps a live balance, and tells you when the dream date does not close — then draws another way.

The plan lives in the browser (`localStorage`, key `vela-plan-v1`). There is no account and no server-side ledger. Clear the site data and the plan is gone.

Open the landing page and either **Begin the interview** or **See Meera in Mumbai**, a finished sample month you can edit.

## What you can do

**Interview.** Eleven short steps. Name, money source (salary, pocket money, freelance, mixed), cadence (week, month, quarter, year), household (solo, partner, or a family and how many people), city, housing pressure, the pulls you already know about (delivery, cafes, shopping, subscriptions, and so on), anything special (student, debt, parents, medical, a baby, a wedding), and the dream: what it is, what it costs, and by when. You can revise the answers later without wiping the ledger.

**Rules.** The split is not a fixed 50/30/20 poster. Needs, joy, and future move with household size, rent pressure, cost of the city, and the specials you named. Pocket money gets a tighter joy band than a salary. The same plan can be read as a week, a month, a quarter, or a year, with an envelope for each seat in the household.

**Compass.** The number at the top is what is left in this period: income (logged, or the plan if you have not logged a paycheck yet) minus spending minus what you already put in the vault. **Safe today** is what is left after the future sleeve is protected, spread across the days still in the period. Beside that: money weather, a category chart, rule drift, recent lines, and two clocks — the date you want, and the date the current surplus can actually reach.

**Ledger.** Add, edit, or delete income, spending, and vault lines. Amounts, categories, notes, and dates are all editable. Joy and named pulls pass through a **quiet hour** first: put it back, send the amount to the dream, or log it anyway. Money you refuse is kept as a receipt so the refusal is visible, not just a feeling.

**Pulls.** Compares this period with a typical basket for your city and household, marks what is running hot, and names the cuts that actually move the dream date.

**Horizon.** Splits what you can set aside into three sleeves: emergency cash, the dream, and a longer sleeve. Each sleeve says where that money usually sits and for how long. A line chart shows the difference between leaving it as cash and letting a simple rate compound. This is a planning picture, not a recommendation to buy anything.

**City.** Ordinary prices for the city you picked, the months machines and appliances usually get cheaper, and what tends to land on the calendar (sales seasons, market rhythm). These are recurring patterns, not live shop flyers or a scrape of today’s discounts.

**Dream.** If the surplus cannot hit the cost by the date, Vela does not just say no. It draws three forks: more time, a smaller version of the same dream, or a side door matched to the life you described (a shift, a freelance hour, a household change). A slider shows what one cut does to the date. You can keep a short letter to the person who will have the money.

## Run it

Node 22 or newer.

```bash
npm install
npm run dev
```

The dev server listens on port `8080`.

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |
| `npm run test` | Script tests and the auth/data unit tests |
| `npm run build` | Production build |
| `npm run preview:restart` | Serve the production build |

`npm run build` also runs the database migrate script. This app’s ledger does not use that database. If `DATABASE_URL` is unset, migrate skips and the build still succeeds.

## How the numbers work

- Cadence is normalized to a month, then shown back in the cadence you picked. A weekly amount is not treated as if it arrived once a month.
- A transaction counts in a period by its calendar date (`YYYY-MM-DD`), not by a timezone-shifted timestamp. A paycheck on the 1st stays in that month.
- Categories sit in **needs**, **joy**, or **pull**. Pulls are capped inside the joy band so a leak cannot quietly eat the future sleeve.
- Remaining balance uses logged income once any income exists in the period. Until then it uses the income you stated in the interview, and the Compass says so.
- Safe-to-spend is the joy (and unused needs) still available today. It is not the whole remaining pot.
- Dream math uses the surplus after the needs and a minimum joy floor. If that surplus is zero or negative, the forks are about creating surplus, not about waiting forever.

## Cities

The city desk ships with a fixed atlas (Mumbai, Delhi, Bengaluru, and others). Each city has a short note, a grocery and housing feel, staple price bands, appliance windows, and seasonal events. Picking a city changes the rule bands, the “what is normal here” comparison, and the cheap-window calendar. It does not call an outside API.

## Layout

```
src/routes/index.tsx          landing, interview, or studio
src/components/vela/          the screens
src/lib/vela/engine.ts        bands, periods, dream math, horizon
src/lib/vela/cities.ts        the city atlas
src/lib/vela/store.tsx        localStorage
src/lib/vela/types.ts         profile, transactions, refusals
public/                       favicon and share image
```

The interview is a step machine. The studio is one page with seven sections: Compass, Ledger, Rules, Pulls, Horizon, City, Dream. **Revise** reopens the interview. **Start over** wipes the plan on this device.

## Stack

React 19, TanStack Start and Router, Tailwind CSS 4, Recharts, date-fns, Vite. Display type is Fraunces. Body type is Outfit. Both are bundled, not loaded from a CDN.

## What this is not

- Not a bank connection. Nothing is imported from an account.
- Not investment advice. Horizon rates are illustrative so you can see time, not a forecast.
- Not a live deal feed. City prices and sale months are curated patterns and will be wrong for a specific shop on a specific day.
- Not a place your plan is backed up. Export is the browser’s own storage. Copy it if you care about keeping it.
