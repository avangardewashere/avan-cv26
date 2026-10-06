"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

// clsx, not cn: keeps tailwind-merge out of the client bundle; nothing here relies on merging.
import { clsx } from "clsx";

/**
 * Not in the v2 handoff, which is dark-only; kept because the site keeps a
 * light theme. Sized and styled like the header's other 36px pill controls
 * so it reads as part of the island rather than an addition to it.
 *
 * Both icons are always rendered and CSS picks one off the theme class that
 * next-themes writes before first paint, so server and client markup match
 * without a mounted-state effect.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className={clsx(
        "text-muted hover:text-foreground hover:bg-foreground/6 duration-hover relative grid size-9 shrink-0 place-items-center rounded-full transition-[color,background-color,scale] motion-safe:active:scale-[0.96]",
        className,
      )}
    >
      <Moon
        aria-hidden
        strokeWidth={1.5}
        className="size-4 dark:hidden"
      />
      <Sun
        aria-hidden
        strokeWidth={1.5}
        className="hidden size-4 dark:block"
      />
      <span className="sr-only dark:hidden">Switch to dark theme</span>
      <span className="sr-only hidden dark:inline">Switch to light theme</span>
    </button>
  );
}
