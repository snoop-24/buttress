"use client";

import { useEffect, useState } from "react";

/**
 * Presentation aid. Open the landing page with `?present` (optionally
 * `&interval=<ms>`, default 7500) and it auto-scrolls through the sections on a
 * timer so the presenter never has to scroll — it loops back to the top after
 * the last section and shows a small on-screen indicator so you can SEE it's on.
 *
 * Gated on the flag so the public page is untouched. A manual scroll or keypress
 * pauses it for a beat and then it resumes — an accidental trackpad brush can
 * never kill it permanently (that was the old bug).
 */
const SECTION_IDS = ["top", "thesis", "backoffice", "loop", "fleet", "code", "cta"];
const NAV_OFFSET = 64; // sticky nav height, so a section lands just below it

export function AutoAdvance() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("present")) return;

    setActive(true);
    document.documentElement.classList.add("present-mode");
    const interval = Math.max(2000, Number(params.get("interval")) || 7500);

    let i = 0;
    let pausedUntil = 0;

    const go = (idx: number) => {
      if (idx === 0) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const el = document.getElementById(SECTION_IDS[idx]);
      if (!el) return;
      // Absolute target (works regardless of current scroll position).
      const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    };

    const timer = window.setInterval(() => {
      if (Date.now() < pausedUntil) return; // user just scrolled — hold, don't fight
      i = (i + 1) % SECTION_IDS.length; // loop back to the top after the last section
      go(i);
    }, interval);

    // A manual scroll / keypress pauses for ~1.5 intervals, THEN resumes — so a
    // stray trackpad touch never permanently stops the tour.
    const pause = () => {
      pausedUntil = Date.now() + interval * 1.5;
    };
    window.addEventListener("wheel", pause, { passive: true });
    window.addEventListener("touchmove", pause, { passive: true });
    window.addEventListener("keydown", pause);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("wheel", pause);
      window.removeEventListener("touchmove", pause);
      window.removeEventListener("keydown", pause);
      document.documentElement.classList.remove("present-mode");
    };
  }, []);

  if (!active) return null;

  // Visible confirmation that presentation mode is live. If you don't see this
  // pill, the ?present flag didn't take — that's the whole diagnostic.
  return (
    <div className="fixed bottom-4 left-4 z-[100] flex items-center gap-2 rounded-full border border-border bg-bg-card/90 px-3 py-1 font-mono text-[11px] text-fg-muted backdrop-blur">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-good" />
      auto-advancing · scroll or press a key to pause
    </div>
  );
}
