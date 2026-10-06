import type {
  ProjectMedia as ProjectMediaData,
  RequestPath as RequestPathData,
} from "@/content/projects";
import { cn } from "@/lib/utils";

/**
 * Fills whatever box it is placed in (the caller owns the aspect ratio and
 * the well colour): the project's banner, or a poster in the homepage's
 * grid-and-glow language when there is none yet.
 */
export function ProjectMedia({
  media,
  title,
  sizes,
  caption = false,
  className,
}: {
  media?: ProjectMediaData;
  title: string;
  /** The rendered width, for picking a file from `srcSet`. */
  sizes?: string;
  /** Show the image's caption chip (detail pages). */
  caption?: boolean;
  className?: string;
}) {
  if (media?.kind === "image") {
    return (
      <>
        {/* Local, pre-sized WebP banners: a plain lazy <img> with srcset, no image optimizer needed. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.src}
          srcSet={media.srcSet}
          sizes={media.srcSet ? sizes : undefined}
          alt={media.alt}
          width={1600}
          height={900}
          loading="lazy"
          decoding="async"
          className={cn("absolute inset-0 size-full object-cover", className)}
        />
        {caption && media.caption ? (
          <span className="bg-media-chip text-media-chip-fg pointer-events-none absolute bottom-3.5 left-3.5 inline-flex h-[26px] items-center rounded-full px-2.5 font-mono text-[11px] tracking-[0.06em] uppercase">
            {media.caption}
          </span>
        ) : null}
      </>
    );
  }

  const initials =
    title
      .split(/\s+/)
      .filter((word) => /^[A-Za-z]/.test(word))
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-hidden",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-size-[36px_36px] bg-center [mask-image:radial-gradient(ellipse_at_50%_45%,black_25%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[45%] left-1/2 aspect-square h-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow-accent-soft),transparent_70%)]"
      />
      <span
        aria-hidden
        className="display text-foreground/12 relative text-[clamp(64px,9vw,128px)] leading-none tracking-[-0.04em] select-none"
      >
        {initials}
      </span>
      <span className="text-muted relative font-mono text-[11px] tracking-[0.06em] uppercase">
        Preview coming soon
      </span>
    </div>
  );
}

/**
 * Server-side work as its request path, e.g. Stripe → Webhook → WooCommerce,
 * with the part I built or fixed lit in the middle. The visual is hidden from
 * screen readers, which get the same path as one sentence.
 */
export function RequestPath({ path }: { path: RequestPathData }) {
  return (
    <div>
      <p className="sr-only">{`${path.nodes.join(", then ")}. ${path.caption}.`}</p>
      {/* Stacked, top to bottom, so a narrow aside never breaks the chain mid-way. */}
      <ol aria-hidden className="m-0 flex list-none flex-col items-start p-0">
        {path.nodes.map((node, i) => (
          <li
            key={node}
            className="flex flex-col items-start not-first:before:bg-accent-ink/45 not-first:before:my-1 not-first:before:ml-[18px] not-first:before:h-2.5 not-first:before:w-px not-first:before:content-['']"
          >
            <span
              className={cn(
                "inline-flex h-7 items-center rounded-full border px-3 font-mono text-[11.5px] tracking-[0.04em]",
                // The middle node is the part I built or fixed.
                i === 1
                  ? "border-accent-ink/45 text-accent-ink bg-accent-ink/8"
                  : "border-foreground/12 text-ink-soft bg-surface",
              )}
            >
              {node}
            </span>
          </li>
        ))}
      </ol>
      <p className="text-muted mt-2 text-[13px] leading-[1.45]" aria-hidden>
        {path.caption}
      </p>
    </div>
  );
}
