import Link from "next/link";

/** Buttress logo mark — a stylized buttress arch (structural support). */
export function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 21V8l8-5 8 5v13" stroke="var(--accent)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 21V11M4 21c3-1 5-4 8-10M20 21c-3-1-5-4-8-10" stroke="var(--fg-muted)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-[15px] font-semibold tracking-tight">Buttress</span>
        </Link>
        <div className="hidden items-center gap-8 text-[14px] text-fg-muted md:flex">
          <Link href="/why" className="transition-colors hover:text-fg">Why</Link>
          <a href="#backoffice" className="transition-colors hover:text-fg">Back office</a>
          <a href="#loop" className="transition-colors hover:text-fg">The Loop</a>
          <a href="#fleet" className="transition-colors hover:text-fg">Fleet</a>
          <Link href="/code" className="transition-colors hover:text-fg">Own the code</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/demo" className="btn-primary px-4 py-1.5 text-[14px]">
            See it run
          </Link>
        </div>
      </nav>
    </header>
  );
}
