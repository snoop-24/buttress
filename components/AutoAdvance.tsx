"use client";

import { useEffect } from "react";

/**
 * Presentation aid. When the landing page is opened with `?present` (optionally
 * `&interval=<ms>`), it auto-scrolls through the sections on a timer so the
 * presenter never has to scroll by hand — the only manual action left is
 * clicking "See it run" to jump to the demo.
 *
 * Deliberately gated on the query flag: the public landing page (the recruitment
 * artifact on the deployed URL) is left completely untouched, so a normal visitor
 * never gets their scroll hijacked. Any manual scroll hands control back for good.
 */
const SECTION_IDS = ["top", "thesis", "backoffice", "loop", "fleet", "code", "cta"];

export function AutoAdvance() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("present")) return;

    // Force every scroll-reveal section fully visible — auto-advance can't wait
    // for reveals to fire, or a jumped-to section shows blank on stage.
    document.documentElement.classList.add("present-mode");

    const interval = Math.max(2000, Number(params.get("interval")) || 7500);
    let i = 0;

    const go = (idx: number) => {
      if (idx === 0) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      document.getElementById(SECTION_IDS[idx])?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    const timer = window.setInterval(() => {
      i += 1;
      if (i >= SECTION_IDS.length) {
        window.clearInterval(timer);
        return;
      }
      go(i);
    }, interval);

    // A real visitor's first manual scroll cancels auto-advance permanently, so
    // it can never fight someone who wants to drive. (Programmatic smooth scroll
    // doesn't emit wheel/touch events, so this only catches human intent.)
    const cancel = () => window.clearInterval(timer);
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      document.documentElement.classList.remove("present-mode");
    };
  }, []);

  return null;
}
