import { useMemo, useState } from "react";
import { getCity } from "@/lib/vela/cities";
import {
  applianceTiming,
  dreamDelayDays,
  formatMoney,
  lifePhrase,
  summarize,
  upcoming,
} from "@/lib/vela/engine";
import type { Profile, Refusal, Tx } from "@/lib/vela/types";
import { Panel } from "./ui";

export function CityDesk({
  profile,
  txs,
  refusals,
}: {
  profile: Profile;
  txs: Tx[];
  refusals: Refusal[];
}) {
  const city = getCity(profile.cityId);
  const now = useMemo(() => new Date(), []);
  const [index, setIndex] = useState(0);
  const item = city.appliances[Math.min(index, city.appliances.length - 1)];
  const timing = item ? applianceTiming(item, now) : null;
  const events = upcoming(city, now);
  const summary = summarize(profile, txs, refusals, now);
  const c = profile.currency;
  const gap = item ? item.fair - item.cheap : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <Panel className="lg:col-span-12">
        <p className="text-sm text-muted">
          {city.name}, {city.country} · seasonal patterns, not today’s flyer
        </p>
        <h2 className="mt-2 text-3xl text-ink">The city desk</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{city.blurb}</p>
      </Panel>

      <Panel className="lg:col-span-5">
        <h2 className="text-2xl text-ink">Ordinary prices</h2>
        <p className="mt-2 text-sm text-muted">
          Cheap day: {city.cheapDay}. {city.market}
        </p>
        <ul className="mt-4 divide-y divide-line">
          {city.staples.map((staple) => (
            <li key={staple.item} className="flex items-baseline justify-between gap-3 py-3">
              <span className="text-sm text-ink">{staple.item}</span>
              <span className="num text-sm text-ink">
                {formatMoney(staple.price, c)}
                <span className="text-faint"> {staple.unit}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">
          A month of groceries for one person, used as the fair line: {formatMoney(city.groceryFair, c)}. Transit,
          one person: {formatMoney(city.transitFair, c)}.
        </p>
      </Panel>

      <Panel className="lg:col-span-7">
        <h2 className="text-2xl text-ink">When a machine is cheaper</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {city.appliances.map((appliance, i) => (
            <button
              key={appliance.item}
              type="button"
              onClick={() => setIndex(i)}
              className={`min-h-11 rounded-md px-3 text-sm ${
                i === index ? "bg-accent text-accent-fg" : "border border-line bg-bg text-ink"
              }`}
            >
              {appliance.item}
            </button>
          ))}
        </div>
        {item && timing ? (
          <div className="mt-5">
            <p className="text-sm text-muted">{item.window}</p>
            <p className="num mt-2 text-3xl text-ink">
              {formatMoney(item.cheap, c)}
              <span className="ml-2 text-base text-faint line-through">{formatMoney(item.fair, c)}</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink">
              {timing.inWindow
                ? "You are inside the cheaper window. If you need it, this is the month to buy the one you named — not three others."
                : `Next typical window: ${timing.nextLabel}, about ${timing.days} days out.`}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Paying the fair price instead of the cheap one is {formatMoney(gap, c)}
              {lifePhrase(gap, profile) ? `, ${lifePhrase(gap, profile)}` : ""}
              {dreamDelayDays(gap, summary.dream.surplusMonthly)
                ? `, about ${dreamDelayDays(gap, summary.dream.surplusMonthly)} days of the dream.`
                : "."}
            </p>
          </div>
        ) : null}
      </Panel>

      <Panel className="lg:col-span-12">
        <h2 className="text-2xl text-ink">Coming up</h2>
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <li key={event.season.title + event.when} className="rounded-md bg-bg p-4">
              <p className="text-xs text-muted">{event.when}</p>
              <p className="mt-1 text-base font-medium text-ink">{event.season.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{event.season.detail}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
