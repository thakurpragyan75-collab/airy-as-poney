import { cn } from "@/lib/cn";

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-xl border border-line bg-surface p-5", className)}>{children}</section>
  );
}

export function PrimaryButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg transition-opacity duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
    />
  );
}

export function GhostButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-md border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors duration-150 hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
    />
  );
}

export function Choice({
  selected,
  title,
  detail,
  onClick,
}: {
  selected: boolean;
  title: string;
  detail?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex min-h-11 w-full items-start gap-3 rounded-md border px-3 py-3 text-left transition-colors duration-150",
        selected ? "border-accent bg-accent-soft" : "border-line bg-surface hover:border-ink",
      )}
    >
      <span
        className={cn(
          "mt-1 size-3 shrink-0 rounded-full border",
          selected ? "border-accent bg-accent" : "border-faint bg-surface",
        )}
        aria-hidden
      />
      <span className="min-w-0">
        <span className="block text-base font-medium text-ink">{title}</span>
        {detail ? <span className="mt-1 block text-sm text-muted">{detail}</span> : null}
      </span>
    </button>
  );
}

export const fieldClass =
  "min-h-11 w-full rounded-md border border-line bg-bg px-3 text-base text-ink outline-none placeholder:text-faint";

export function Label({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 block text-sm font-medium text-ink">{children}</span>;
}

export function Status({
  status,
}: {
  status: "hot" | "steady" | "light" | "unlogged";
}) {
  const label =
    status === "hot" ? "Hot" : status === "light" ? "Light" : status === "steady" ? "Steady" : "Unlogged";
  const cls =
    status === "hot"
      ? "bg-brick-soft text-brick"
      : status === "light"
        ? "bg-accent-soft text-accent"
        : "bg-bg text-muted";
  return <span className={cn("rounded-sm px-2 py-1 text-xs font-medium", cls)}>{label}</span>;
}
