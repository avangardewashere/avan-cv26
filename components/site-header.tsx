"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";

import { navItems, sectionIds } from "@/content/nav";
import { profile } from "@/content/profile";
import { pillVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useScrollSpy } from "@/lib/use-scroll-spy";
// clsx, not cn: keeps tailwind-merge out of the client bundle; no call below relies on merging.
import { clsx } from "clsx";

/**
 * The floating island. From 760px up: logo + name, section links, theme
 * toggle, "Get in touch". Below: logo, theme toggle, and a Menu/Close text
 * button that opens a full-screen overlay.
 *
 * Every href is `/#id`: this header renders on /projects/* too, where a bare
 * `#id` has nothing to scroll to.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  // Any route change (link, Back, Forward) closes the menu. Reset during render,
  // not in an effect, so the next page never paints with the overlay still up.
  const [menuPathname, setMenuPathname] = useState(pathname);
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setMenuOpen(false);
  }
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLElement>(null);

  const spied = useScrollSpy(sectionIds, 96, pathname);
  // On project pages "Work" is where you are; on the homepage it's the scroll position.
  const activeId = pathname.startsWith("/projects") ? "work" : spied;

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };
    // The overlay only exists below 760px; widening the window closes it.
    const wide = window.matchMedia("(min-width: 760px)");
    const onWide = () => wide.matches && setMenuOpen(false);
    const previousOverflow = document.body.style.overflow;
    // Everything but the header and the overlay: keyboard and screen-reader focus stay in the menu.
    const covered = Array.from(document.body.children).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement &&
        el !== headerRef.current &&
        el !== overlayRef.current &&
        el.tagName !== "SCRIPT",
    );

    document.addEventListener("keydown", onKeyDown);
    wide.addEventListener("change", onWide);
    document.body.style.overflow = "hidden";
    covered.forEach((el) => (el.inert = true));

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      wide.removeEventListener("change", onWide);
      document.body.style.overflow = previousOverflow;
      covered.forEach((el) => (el.inert = false));
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  // next/link treats a click on the URL you are already on (e.g. /#work → /#work)
  // as a refresh and does not scroll; handle that one case natively.
  const jumpTo = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    close();
    if (onHome && window.location.hash === `#${id}`) {
      e.preventDefault();
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    }
  };

  const goHome = (e: MouseEvent<HTMLAnchorElement>) => {
    close();
    // Already on "/" with no hash, next/link has nothing to do; scroll up instead.
    if (onHome && !window.location.hash) {
      e.preventDefault();
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <div className="bg-nav border-foreground/8 shadow-nav pointer-events-auto flex items-center gap-1 rounded-full border p-1.5 backdrop-blur-[20px]">
          <Link
            href="/"
            prefetch={onHome ? false : null}
            onClick={goHome}
            className="flex h-9 items-center gap-2.5 pr-3 pl-1"
          >
            <span
              aria-hidden
              className="bg-accent text-accent-foreground grid size-7 place-items-center rounded-full font-mono text-xs font-medium"
            >
              AP
            </span>
            {/* Hidden visually below 760px, but always the link's accessible name. */}
            <span className="sr-only text-[14px] font-medium min-[760px]:not-sr-only">
              {profile.shortName}
            </span>
          </Link>

          <nav
            aria-label="Sections"
            className="text-muted hidden gap-0.5 text-[13.5px] min-[760px]:flex"
          >
            {navItems.map((item) => {
              const active = activeId === item.id;
              return (
                <Link
                  key={item.id}
                  href={`/#${item.id}`}
                  prefetch={onHome ? false : null}
                  onClick={jumpTo(item.id)}
                  aria-current={active ? "true" : undefined}
                  className={clsx(
                    "hover:bg-foreground/6 hover:text-foreground duration-hover rounded-full px-3 py-2 transition-colors",
                    active && "bg-foreground/6 text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <ThemeToggle className="min-[760px]:ml-0.5" />

          <a
            href={`mailto:${profile.email}`}
            className={clsx(
              pillVariants({ variant: "solid", size: "sm" }),
              "ml-1.5 max-[760px]:hidden",
            )}
          >
            Get in touch
          </a>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? "mobile-menu" : undefined}
            className="bg-foreground/6 duration-hover h-9 rounded-full px-3.5 text-[13.5px] font-medium transition-[scale] motion-safe:active:scale-[0.96] min-[760px]:hidden"
          >
            {/* Both labels share one grid cell, so the island keeps the wider one's width. */}
            <span className="grid h-9 overflow-clip *:[grid-area:1/1] *:leading-9">
              <span
                aria-hidden={menuOpen ? true : undefined}
                className={clsx(
                  "duration-lift ease-fluid transition-[translate,opacity]",
                  menuOpen && "-translate-y-full opacity-0",
                )}
              >
                Menu
              </span>
              <span
                aria-hidden={menuOpen ? undefined : true}
                className={clsx(
                  "duration-lift ease-fluid transition-[translate,opacity]",
                  !menuOpen && "translate-y-full opacity-0",
                )}
              >
                Close
              </span>
            </span>
          </button>
        </div>
      </header>

      {menuOpen ? (
        <nav
          ref={overlayRef}
          id="mobile-menu"
          aria-label="Sections"
          // justify-center-safe + symmetric padding: centred when it fits, scrollable when it doesn't.
          className="bg-background/92 duration-expand ease-fluid fixed inset-0 z-40 flex flex-col justify-center-safe gap-1.5 overflow-y-auto overscroll-contain px-7 py-[88px] backdrop-blur-[24px] transition-opacity starting:opacity-0 min-[760px]:hidden"
        >
          {navItems.map((item, i) => (
            <Link
              key={item.id}
              href={`/#${item.id}`}
              prefetch={onHome ? false : null}
              onClick={jumpTo(item.id)}
              className="display py-2 text-[44px] tracking-[-0.03em]"
            >
              {/* The clip sits inside the link so the focus outline is never cut off. */}
              <span className="block overflow-clip">
                <span
                  className="ease-fluid block transition-[translate,opacity] delay-(--d) duration-[700ms] starting:translate-y-full starting:opacity-0"
                  style={{ "--d": `${90 + i * 55}ms` } as CSSProperties}
                >
                  {item.label}
                </span>
              </span>
            </Link>
          ))}
          {onHome ? (
            // The rise lives on a wrapper so its delay never reaches the pill's hover and press.
            <div
              className="ease-fluid mt-6 flex flex-col transition-[translate,opacity] delay-(--d) duration-[700ms] starting:translate-y-3 starting:opacity-0"
              style={{ "--d": "310ms" } as CSSProperties}
            >
              <a
                href={`mailto:${profile.email}`}
                onClick={close}
                className={clsx(
                  pillVariants({ variant: "accent", size: null }),
                  "h-[52px] px-4 text-[16px]",
                )}
              >
                Get in touch
              </a>
            </div>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}
