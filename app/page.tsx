import Link from "next/link";
import { Nav } from "@/components/Nav";
import { IsometricFactory } from "@/components/IsometricFactory";
import { LoopRing } from "@/components/LoopRing";
import { LOOP_NODES } from "@/components/loop";
import { Reveal } from "@/components/Reveal";

export default function Landing() {
  return (
    <main className="flex-1">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[520px]" />
        <div className="mx-auto max-w-4xl px-6 pt-24 pb-16 text-center">
          <h1 className="display fade-up mt-4 text-5xl font-semibold sm:text-6xl md:text-7xl">
            Everyone is fighting over
            <br /> the same workers.
            <br />
            <span className="text-fg-muted">We manufacture new ones.</span>
          </h1>
          <p className="fade-up mx-auto mt-7 max-w-2xl text-lg text-fg-muted">
            Buttress reads your project pipeline, predicts the trades you&rsquo;ll be short,
            and recruits career-switchers into them — then dispatches them onto the exact
            jobs that created the demand.
          </p>
          <div className="fade-up mt-9 flex items-center justify-center gap-4">
            <Link href="/demo" className="btn-primary px-6 py-2.5 text-[15px]">
              See it run →
            </Link>
            <a href="#loop" className="text-[15px] text-fg-muted transition-colors hover:text-fg">
              How the loop works
            </a>
          </div>
        </div>

        {/* Isometric hero */}
        <div className="px-6 pb-10">
          <IsometricFactory />
        </div>
        <p className="mx-auto max-w-2xl px-6 pb-24 text-center text-fg-muted">
          Powering the firms that build America.
          <span className="text-fg-dim"> From regional GCs to national builders.</span>
        </p>
      </section>

      {/* Thesis split */}
      <section id="thesis" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
         <Reveal>
          <p className="eyebrow mb-3 text-center">The whitespace</p>
          <h2 className="display mx-auto max-w-3xl text-center text-4xl font-semibold sm:text-5xl">
            Everyone else operates downstream of a worker who already exists.
          </h2>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-bg-card p-8">
              <p className="eyebrow mb-4">Everyone else · allocation</p>
              <p className="text-2xl font-medium text-fg-muted">Match, forecast, or manage the workers who already have the trade.</p>
              <p className="mt-4 text-fg-dim">They fight over the same shrinking pool — ~350k+ trade jobs short and retirements outpacing entries.</p>
            </div>
            <div className="rounded-2xl border border-accent/30 bg-accent/[0.03] p-8" style={{ boxShadow: "0 0 60px -30px var(--accent-glow)" }}>
              <p className="eyebrow mb-4 text-accent-soft">Buttress · manufacture</p>
              <p className="text-2xl font-medium text-fg">Convert career-switchers into net-new trade supply — pointed at your exact shortfall.</p>
              <p className="mt-4 text-fg-muted">AI is displacing white-collar work, producing exactly the people the trades need. We route them in, credential them, and place them.</p>
            </div>
          </div>
         </Reveal>
        </div>
      </section>

      {/* The Loop */}
      <section id="loop" className="border-t border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-3">The closed loop</p>
            <h2 className="display text-4xl font-semibold sm:text-5xl">One loop. It compounds.</h2>
            <p className="mt-5 text-lg text-fg-muted">
              The back office reveals labor demand. The supply factory fills it. New workers
              let the firm take on more projects — which creates more demand. Each turn makes
              the next one bigger.
            </p>
            <ul className="mt-8 space-y-3">
              {LOOP_NODES.map((n) => (
                <li key={n.id} className="flex items-start gap-3">
                  <span className="mt-0.5 font-mono text-[12px] text-accent-soft">{n.n}</span>
                  <span className="text-fg">{n.name}</span>
                  <span className="font-mono text-[12px] text-fg-dim">— {n.io}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="flex justify-center">
            <LoopRing />
          </div>
        </div>
      </section>

      {/* Fleet grid */}
      <section id="fleet" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
         <Reveal>
          <p className="eyebrow mb-3">The fleet</p>
          <h2 className="display max-w-2xl text-4xl font-semibold sm:text-5xl">Six agents, one contract.</h2>
          <p className="mt-4 max-w-2xl text-fg-muted">Every node is a typed input → output. Deterministic where the numbers must be provable; generative where the work is creative.</p>
         </Reveal>
          <Reveal className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LOOP_NODES.map((n) => (
              <div key={n.id} className="rounded-xl border border-border bg-bg-card p-6 transition-colors hover:border-border-strong">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[13px] text-accent-soft">{n.n}</span>
                  <span className="h-2 w-2 rounded-full bg-border-strong" />
                </div>
                <h3 className="text-lg font-medium">{n.name}</h3>
                <p className="mt-1 text-[14px] text-fg-muted">{n.role}</p>
                <p className="mt-4 font-mono text-[12px] text-fg-dim">{n.io}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Own the code */}
      <section id="code" className="border-t border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-3">Anti-black-box</p>
            <h2 className="display text-4xl font-semibold sm:text-5xl">We hand you a codebase, not a flowchart.</h2>
            <p className="mt-5 text-lg text-fg-muted">
              Every other agent builder locks you into a canvas you can&rsquo;t leave. Buttress
              emits your fleet as real, editable agent code you own — open it, read it, change it.
            </p>
            <Link href="/code" className="mt-6 inline-block btn-ghost px-5 py-2 text-[14px]">
              Open the codebase →
            </Link>
          </Reveal>
          <div className="rounded-xl border border-border bg-bg-card p-5 font-mono text-[12.5px] leading-relaxed">
            <div className="mb-3 flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
              <span className="ml-2 text-fg-dim">agents/forecaster.ts</span>
            </div>
            <pre className="overflow-x-auto text-fg-muted">
{`export function forecastGaps(input) {
  // demand vs roster → the gap signal
  const gap = peak.headcount - roster;
  return { trade, `}<span className="text-accent-soft">{`gap: 12`}</span>{`,
    neededByWeek: 6 };  `}<span className="text-good">{`// provable`}</span>{`
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-28 text-center">
         <Reveal>
          <h2 className="display text-4xl font-semibold sm:text-5xl">Watch the loop close in 90 seconds.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-fg-muted">A live run: a project lands, the gap appears, the campaign generates on screen, the pipeline fills, and the workers get dispatched.</p>
          <Link href="/demo" className="btn-primary mt-9 inline-block px-7 py-3 text-[15px]">See it run →</Link>
         </Reveal>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-[13px] text-fg-dim sm:flex-row">
          <span>Buttress · the workforce supply factory</span>
          <span className="font-mono">deterministic proof · you own the code</span>
        </div>
      </footer>
    </main>
  );
}
