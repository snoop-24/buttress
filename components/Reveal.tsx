"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal wrapper. When it scrolls into view naturally, its direct
 * children fade and rise in, staggered line by line. But when you ARRIVE via a
 * nav anchor / deep link (or it's already in view on mount), it appears
 * instantly with no animation — so jumping to a section never shows a blank,
 * mid-reveal flash. Reveals once, then stops observing.
 */
export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const showInstant = () => {
      setInstant(true);
      setShown(true);
    };

    // Already in / above the viewport on mount (e.g. a deep link, or a short
    // page): show at once, no animation.
    if (el.getBoundingClientRect().top < window.innerHeight * 1.05) {
      showInstant();
      return;
    }

    // Anchor jump: if the current hash targets a section containing this
    // element, reveal it instantly rather than animating from invisible.
    const onHash = () => {
      if (!location.hash) return;
      let target: Element | null = null;
      try {
        target = document.querySelector(location.hash);
      } catch {
        return;
      }
      if (target && target.contains(el)) showInstant();
    };
    onHash();
    window.addEventListener("hashchange", onHash);

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShown(true);
            io?.disconnect();
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
      );
      io.observe(el);
    } else {
      setShown(true);
    }

    return () => {
      io?.disconnect();
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-shown={shown}
      className={`reveal ${instant ? "reveal-instant" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
