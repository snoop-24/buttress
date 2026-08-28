"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Nav";
import { emitFleet } from "@/factory/emit";
import { DEMO_FIRM } from "@/data/seed";

export default function CodePage() {
  const files = useMemo(() => emitFleet(DEMO_FIRM), []);
  const [active, setActive] = useState(1); // config.ts by default
  const [downloading, setDownloading] = useState(false);

  // Strip the fleet-root prefix so the tree reads cleanly.
  const root = files[0].path.split("/")[0];
  const rel = (p: string) => p.slice(root.length + 1);

  async function download() {
    setDownloading(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      files.forEach((f) => zip.file(f.path, f.content));
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${root}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  const activeFile = files[active];
  const lines = activeFile.content.replace(/\n$/, "").split("\n");

  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/70 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-[15px] font-semibold tracking-tight">Buttress</span>
            <span className="ml-2 font-mono text-[12px] text-fg-dim">/ own the code</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/why" className="text-[14px] text-fg-muted transition-colors hover:text-fg">
              Why
            </Link>
            <Link href="/demo" className="btn-primary px-4 py-1.5 text-[14px]">
              See it run →
            </Link>
          </div>
        </nav>
      </header>

      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {/* Intro */}
        <p className="eyebrow mb-3">Anti-black-box</p>
        <h1 className="display max-w-3xl text-4xl font-semibold sm:text-5xl">
          Not a flowchart. A codebase you own.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-fg-muted">
          Every other agent builder traps your fleet in a canvas you can&rsquo;t leave. Buttress emits
          <span className="text-fg"> {DEMO_FIRM.name}&rsquo;s</span> fleet as real, editable TypeScript —
          parameterized to your roster and region. Read it, change it, open it in Qoder, take it with you.
        </p>

        {/* IDE */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-border-strong bg-bg-card">
          {/* Title bar */}
          <div className="flex items-center justify-between border-b border-border bg-bg-elevated px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
              <span className="ml-3 font-mono text-[12px] text-fg-dim">{root}/</span>
            </div>
            <button
              onClick={download}
              disabled={downloading}
              className="btn-ghost px-3 py-1 font-mono text-[12px] disabled:opacity-50"
            >
              {downloading ? "zipping…" : "↓ Download .zip"}
            </button>
          </div>

          <div className="grid md:grid-cols-[220px_1fr]">
            {/* File tree */}
            <div className="border-b border-border p-2 md:border-b-0 md:border-r">
              {files.map((f, i) => {
                const name = rel(f.path);
                const nested = name.includes("/");
                return (
                  <button
                    key={f.path}
                    onClick={() => setActive(i)}
                    className={`block w-full truncate rounded px-3 py-1.5 text-left font-mono text-[12.5px] transition-colors ${
                      i === active ? "bg-accent/10 text-accent-soft" : "text-fg-muted hover:bg-bg-elevated"
                    } ${nested ? "pl-6" : ""}`}
                  >
                    {nested ? name.split("/").slice(1).join("/") : name}
                  </button>
                );
              })}
            </div>

            {/* Code viewer */}
            <div className="overflow-x-auto bg-bg">
              <div className="flex items-center justify-between border-b border-border px-4 py-2">
                <span className="font-mono text-[12px] text-fg-muted">{rel(activeFile.path)}</span>
                <span className="font-mono text-[11px] text-fg-dim">{activeFile.language}</span>
              </div>
              <pre className="min-w-max px-2 py-4 font-mono text-[12.5px] leading-relaxed">
                {lines.map((line, i) => (
                  <div key={i} className="flex">
                    <span className="w-10 shrink-0 select-none pr-4 text-right text-fg-dim">{i + 1}</span>
                    <code className="text-fg-muted">{line || " "}</code>
                  </div>
                ))}
              </pre>
            </div>
          </div>
        </div>

        <p className="mt-4 font-mono text-[11px] text-fg-dim">
          {files.length} files · generated deterministically from {DEMO_FIRM.name}&rsquo;s config · yours to keep
        </p>
      </div>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-[13px] text-fg-dim">
          <span>Buttress · the workforce supply factory</span>
          <Link href="/" className="font-mono transition-colors hover:text-fg">← home</Link>
        </div>
      </footer>
    </main>
  );
}
