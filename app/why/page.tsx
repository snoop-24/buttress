import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/Nav";
import { LoopRing } from "@/components/LoopRing";
import { LOOP_NODES } from "@/components/loop";

export const metadata: Metadata = {
  title: "Why Buttress — the workforce supply factory",
  description:
    "The rundown: what Buttress is, why it's useful, why it's impactful, why it wins users, and the compounding closed-loop moat that no incumbent can copy.",
};

/** Competitive comparison, grounded in the market research. */
const COMPETITORS: { name: string; does: string; supply: "no" | "partial" }[] = [
  { name: "Trunk Tools / Cortex", does: "AI over project docs — RFIs, submittals, drawings", supply: "no" },
  { name: "Skillit", does: "Recruits & vets skilled workers who already have the trade", supply: "no" },
  { name: "Bridgit / Buildr", does: "Forecasts & allocates the existing salaried workforce", supply: "no" },
  { name: "SkillCat / Interplay", does: "Trains & upskills — but school-model, not tied to your pipeline", supply: "partial" },
];

function SeeItRun({ className = "" }: { className?: string }) {
  return (
    <Link href="/demo" className={`btn-primary px-6 py-2.5 text-[15px] ${className}`}>
      See it run →
    </Link>
  );
}

export default function Why() {
  return (
    <main className="flex-1">
      {/* Slim header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/70 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-[15px] font-semibold tracking-tight">Buttress</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[14px] text-fg-muted transition-colors hover:text-fg">
              Home
            </Link>
            <SeeItRun className="!px-4 !py-1.5 !text-[14px]" />
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[420px]" />
        <div className="mx-auto max-w-4xl px-6 pt-20 pb-16 text-center">
          <p className="eyebrow fade-up mb-5">The rundown</p>
          <h1 className="display fade-up text-5xl font-semibold sm:text-6xl">
            The paperwork already reveals the shortage.
            <br />
            <span className="text-fg-muted">Buttress turns it into the campaign that fills it.</span>
          </h1>
          <p className="fade-up mx-auto mt-7 max-w-2xl text-lg text-fg-muted">
            Buttress automates the construction back office and reads, from your own documents, exactly
            which trades your pipeline will fall short on — then <span className="text-fg">auto-generates
            the recruitment campaign to fill each gap</span>, in the right region, before the crews are due.
          </p>
          <div className="fade-up mt-9">
            <SeeItRun />
          </div>
        </div>
      </section>

      {/* 1. What it is */}
      <Section eyebrow="What it is" title="One closed loop, run by six agents.">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-5 text-lg text-fg-muted">
            <p>
              Buttress reads a firm&rsquo;s project pipeline and predicts which trades will fall short —
              <span className="text-fg"> where and when</span>. Then it runs autonomous recruitment
              marketing that converts career-switchers <span className="text-fg">into</span> that trade,
              nurtures them to credentialed, and dispatches them onto the job that created the demand.
            </p>
            <p>
              The back office reveals labor demand. The supply factory fills it. New workers let the firm
              take on more projects — which creates more demand. <span className="text-fg">Each turn makes
              the next one bigger.</span>
            </p>
            <ul className="space-y-2 pt-2">
              {LOOP_NODES.map((n) => (
                <li key={n.id} className="flex items-baseline gap-3 text-[15px]">
                  <span className="font-mono text-[12px] text-accent-soft">{n.n}</span>
                  <span className="text-fg">{n.name}</span>
                  <span className="font-mono text-[12px] text-fg-dim">— {n.io}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <LoopRing size={420} />
          </div>
        </div>
      </Section>

      {/* 2. Why it's useful */}
      <Section eyebrow="Why it's useful" title="A GC can't bid work it can't staff." alt>
        <div className="grid gap-5 md:grid-cols-3">
          <Card title="The bottleneck is people.">
            Firms are turning down projects — not for lack of demand or capital, but because they physically
            cannot crew them. Every unstaffed trade is revenue they leave on the table.
          </Card>
          <Card title="Everyone else fights over the same pool.">
            Recruiting and forecasting tools just reshuffle the workers who already exist. When the pool is
            shrinking, that&rsquo;s a zero-sum game.
          </Card>
          <Card title="Buttress grows the pool.">
            It brings net-new people into the trade and places them on your jobs — turning a hiring problem
            into a marketing-and-training problem software can actually solve.
          </Card>
        </div>
      </Section>

      {/* 3. Why it's impactful */}
      <Section eyebrow="Why it's impactful" title="The two biggest labor stories of the decade, closing a loop.">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-bg-card p-8">
            <p className="text-2xl font-medium text-fg">AI is emptying the cubicles.</p>
            <p className="mt-4 text-fg-muted">
              White-collar and entry-level roles are being automated, producing a wave of capable
              career-switchers looking for stable, un-automatable work.
            </p>
          </div>
          <div className="rounded-2xl border border-accent/30 bg-accent/[0.03] p-8" style={{ boxShadow: "0 0 60px -30px var(--accent-glow)" }}>
            <p className="text-2xl font-medium text-fg">The trades are starving for them.</p>
            <p className="mt-4 text-fg-muted">
              Industry groups model <span className="text-fg">hundreds of thousands</span> of additional
              construction workers needed, with retirements outpacing entries. Policy tailwinds
              (federal apprenticeship pushes, private skilling funds) all aim at growing the pipeline.
            </p>
          </div>
        </div>
        <p className="mt-6 text-center text-fg-muted">
          Buttress routes the first group into the second — the work AI creates, aimed at the work AI can&rsquo;t do.
        </p>
      </Section>

      {/* 4. Why it gets users */}
      <Section eyebrow="Why it wins users" title="Painkiller, not vitamin — and impossible to lock out of." alt>
        <div className="grid gap-5 md:grid-cols-3">
          <Card title="Acute, quantified pain.">
            The buyer already knows the number: the crews they&rsquo;re short and the projects it costs them.
            Buttress attaches directly to that number.
          </Card>
          <Card title="Land, then compound.">
            Start with one trade in one region. As the loop fills roles and unlocks more projects, it expands
            across trades and offices on its own.
          </Card>
          <Card title="You own the code.">
            Every other agent builder hands you a flowchart you can&rsquo;t leave. Buttress emits your fleet as
            real, editable agent code you keep — anti-black-box, zero lock-in fear.
          </Card>
        </div>
      </Section>

      {/* 5. The moat */}
      <Section eyebrow="The moat" title="The whole loop compounds. A point solution can't.">
        <div className="mx-auto max-w-3xl space-y-5 text-lg text-fg-muted">
          <p>
            The defensibility isn&rsquo;t any single agent — it&rsquo;s that Buttress owns the
            <span className="text-fg"> entire demand-to-supply-to-placement loop</span>. Each turn feeds the next:
            demand data sharpens targeting, placements prove conversion, proven conversion wins more of the
            firm&rsquo;s pipeline, more pipeline reveals more demand.
          </p>
          <p>
            Nobody else runs this loop end to end. The pieces exist in isolation — forecasting here, recruiting
            there, training somewhere else — but the <span className="text-fg">integration is the product</span>,
            and it gets stronger with every worker it places.
          </p>
        </div>
      </Section>

      {/* 6. Differentiation */}
      <Section eyebrow="How we're different" title="Everyone else is downstream of a worker who already exists." alt>
        <p className="mx-auto mb-10 max-w-2xl text-center text-fg-muted">
          The market is crowded with tools that match, forecast, or train workers. None of them
          <span className="text-fg"> manufacture net-new supply pointed at your exact pipeline gap.</span>
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border-strong">
                <th className="py-3 pr-4 font-mono text-[12px] font-normal text-fg-dim">PLAYER</th>
                <th className="py-3 pr-4 font-mono text-[12px] font-normal text-fg-dim">WHAT THEY DO</th>
                <th className="py-3 font-mono text-[12px] font-normal text-fg-dim">MAKES NET-NEW SUPPLY?</th>
              </tr>
            </thead>
            <tbody>
              {COMPETITORS.map((c) => (
                <tr key={c.name} className="border-b border-border">
                  <td className="py-4 pr-4 font-medium text-fg">{c.name}</td>
                  <td className="py-4 pr-4 text-[14px] text-fg-muted">{c.does}</td>
                  <td className="py-4">
                    {c.supply === "no" ? (
                      <span className="font-mono text-[13px] text-fg-dim">✕ No</span>
                    ) : (
                      <span className="font-mono text-[13px] text-fg-muted">◐ Partial — not pipeline-linked</span>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="bg-accent/[0.04]">
                <td className="py-4 pr-4 font-semibold text-fg">Buttress</td>
                <td className="py-4 pr-4 text-[14px] text-fg">
                  Predicts the gap, recruits career-switchers into the trade, credentials & dispatches them onto the job
                </td>
                <td className="py-4">
                  <span className="font-mono text-[13px] text-good">✓ Yes — the whole loop</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-6 font-mono text-[11px] text-fg-dim">
          Positioning is complementary, not combative — Buttress can sit on top of forecasting and training partners; it owns the loop they don&rsquo;t.
        </p>
      </Section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-28 text-center">
          <h2 className="display text-4xl font-semibold sm:text-5xl">Don&rsquo;t take our word for it.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-fg-muted">
            Watch the loop close in real time — a project lands, the gap appears, the campaign generates live,
            the pipeline fills, and the workers get dispatched.
          </p>
          <SeeItRun className="mt-9 inline-block" />
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-10 text-[13px] text-fg-dim sm:flex-row">
          <span>Buttress · the workforce supply factory</span>
          <Link href="/" className="font-mono transition-colors hover:text-fg">← back to home</Link>
        </div>
      </footer>
    </main>
  );
}

function Section({
  eyebrow,
  title,
  alt,
  children,
}: {
  eyebrow: string;
  title: string;
  alt?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`border-b border-border ${alt ? "bg-bg-elevated/30" : ""}`}>
      <div className="mx-auto max-w-5xl px-6 py-20">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="display mb-10 max-w-3xl text-4xl font-semibold sm:text-5xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-bg-card p-6">
      <h3 className="text-lg font-medium text-fg">{title}</h3>
      <p className="mt-3 text-[15px] text-fg-muted">{children}</p>
    </div>
  );
}
