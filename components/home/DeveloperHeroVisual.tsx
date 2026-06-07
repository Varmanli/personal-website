import {
  FiActivity,
  FiBox,
  FiCheckCircle,
  FiCpu,
  FiDatabase,
  FiGitBranch,
  FiLayers,
  FiServer,
  FiTerminal,
} from "react-icons/fi";

/**
 * Premium decorative developer/programming visual for the hero.
 * Pure CSS/Tailwind animation, no JS, no new dependencies.
 * Decorative only, so it is hidden from assistive technologies.
 */
const CODE_LINES = [
  {
    n: 1,
    content: (
      <>
        <span className="text-accent">export async function</span>{" "}
        <span className="text-primary-light">buildProduct</span>
        <span className="text-faint">() {"{"}</span>
      </>
    ),
  },
  {
    n: 2,
    content: (
      <>
        <span className="text-faint"> const</span>{" "}
        <span className="text-cyan-400">system</span>{" "}
        <span className="text-faint">= await</span>{" "}
        <span className="text-primary-light">create</span>
        <span className="text-faint">({"{"}</span>
      </>
    ),
  },
  {
    n: 3,
    content: (
      <>
        <span className="text-faint"> ui:</span>{" "}
        <span className="text-emerald-400">&quot;premium interface&quot;</span>
        <span className="text-faint">,</span>
      </>
    ),
  },
  {
    n: 4,
    content: (
      <>
        <span className="text-faint"> api:</span>{" "}
        <span className="text-emerald-400">&quot;secure backend&quot;</span>
        <span className="text-faint">,</span>
      </>
    ),
  },
  {
    n: 5,
    content: (
      <>
        <span className="text-faint"> scale:</span>{" "}
        <span className="text-emerald-400">&quot;production ready&quot;</span>
        <span className="text-faint">,</span>
      </>
    ),
  },
  {
    n: 6,
    content: <span className="text-faint"> {"});"}</span>,
  },
  {
    n: 7,
    content: (
      <>
        <span className="text-faint"> return</span>{" "}
        <span className="text-primary-light">system</span>
        <span className="text-faint">;</span>
        <span className="ms-1 inline-block h-3.5 w-[2px] translate-y-0.5 animate-blink bg-primary-light align-middle" />
      </>
    ),
  },
  {
    n: 8,
    content: <span className="text-faint">{"}"}</span>,
  },
];

const METRICS = [
  { label: "UI", value: "98%", icon: <FiLayers /> },
  { label: "API", value: "200", icon: <FiServer /> },
  { label: "DB", value: "SYNC", icon: <FiDatabase /> },
];

export function DeveloperHeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-md select-none lg:max-w-lg"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-35 mask-[radial-gradient(ellipse_at_center,black,transparent_72%)]" />

      <div className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 animate-pulse-soft rounded-full bg-linear-to-br from-primary/25 via-cyan-500/10 to-accent/25 blur-3xl" />

      <div className="absolute -right-8 top-10 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -left-8 bottom-10 h-44 w-44 rounded-full bg-accent/15 blur-3xl" />

      {/* Decorative orbit */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[108%] -translate-x-1/2 -translate-y-1/2 animate-orbit orbit-ring opacity-45" />

      {/* Particles */}
      {[
        "left-[14%] top-[18%]",
        "left-[84%] top-[26%]",
        "left-[18%] top-[78%]",
        "left-[78%] top-[82%]",
        "left-[50%] top-[8%]",
      ].map((pos, index) => (
        <span
          key={pos}
          className={`absolute ${pos} h-1.5 w-1.5 animate-pulse-soft rounded-full bg-primary/70 shadow-[0_0_14px_rgba(79,124,255,0.85)]`}
          style={{ animationDelay: `${index * 0.55}s` }}
        />
      ))}

      {/* Main visual group */}
      <div className="float-slow absolute left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2">
        <div className="relative rounded-[2rem] border border-border bg-surface/65 p-2 backdrop-blur-2xl shadow-[0_35px_110px_-35px_rgba(79,124,255,0.65)]">
          <div className="absolute inset-0 rounded-[2rem] bg-linear-to-br from-primary/25 via-transparent to-accent/25 opacity-70" />

          <div className="relative overflow-hidden rounded-[1.65rem] border border-white/5 bg-background/82">
            {/* Top bar */}
            <div className="flex items-center border-b border-border/80 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 rounded-full bg-green-400/80" />
              </div>

              <div className="mx-auto flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-3 py-1 font-mono text-[0.65rem] text-faint">
                <FiGitBranch className="text-primary-light" />
                product-lab/main
              </div>

              <span className="rounded-lg border border-primary/30 bg-primary/10 px-2 py-1 font-mono text-[0.62rem] font-bold text-primary-light">
                LIVE
              </span>
            </div>

            {/* Code editor */}
            <div
              dir="ltr"
              className="space-y-1.5 px-4 py-4 text-left font-mono text-[0.7rem] leading-relaxed sm:text-xs"
            >
              {CODE_LINES.map((line) => (
                <CodeLine key={line.n} n={line.n}>
                  {line.content}
                </CodeLine>
              ))}
            </div>

            {/* Bottom metrics */}
            <div className="grid grid-cols-3 border-t border-border/80 bg-surface-2/30">
              {METRICS.map((item) => (
                <div
                  key={item.label}
                  className="border-e border-border/70 px-3 py-3 last:border-e-0"
                >
                  <div className="mb-1 flex items-center gap-1.5 text-[0.65rem] text-faint">
                    <span className="text-primary-light">{item.icon}</span>
                    {item.label}
                  </div>
                  <div className="font-mono text-xs font-bold text-foreground">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Terminal card */}
      <div
        className="float-card absolute -left-2 top-6 hidden w-48 sm:block"
        style={{ animationDelay: "0.7s" }}
      >
        <div className="neon-card rounded-2xl p-3 shadow-2xl">
          <div className="mb-2 flex items-center gap-2 text-[0.68rem] text-faint">
            <FiTerminal className="text-primary-light" />
            terminal
          </div>

          <div
            dir="ltr"
            className="text-left font-mono text-[0.64rem] leading-relaxed"
          >
            <p className="text-muted">
              <span className="text-success">➜</span> pnpm build
            </p>
            <p className="animate-shimmer text-primary-light">
              ✓ optimized successfully
            </p>
            <p className="text-faint">ready in 1.8s</p>
          </div>
        </div>
      </div>

      {/* System card */}
      <div
        className="float-card absolute -right-2 bottom-12 hidden w-48 sm:block"
        style={{ animationDelay: "1.4s" }}
      >
        <div className="neon-card rounded-2xl p-3 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[0.68rem] text-faint">
              <FiActivity className="text-accent" />
              system health
            </div>
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-success shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
          </div>

          <div className="space-y-2">
            <StatusRow label="API latency" value="42ms" />
            <StatusRow label="Database" value="synced" />
            <StatusRow label="Deploy" value="stable" />
          </div>
        </div>
      </div>

      {/* Mini architecture card */}
      <div
        className="float-card absolute bottom-1 left-1/2 w-[72%] -translate-x-1/2"
        style={{ animationDelay: "2s" }}
      >
        <div className="rounded-2xl border border-border bg-surface/75 px-4 py-3 backdrop-blur-xl shadow-[0_18px_60px_-28px_rgba(79,124,255,0.8)]">
          <div className="flex items-center justify-between gap-3">
            <FlowNode icon={<FiBox />} label="UI" />
            <FlowLine />
            <FlowNode icon={<FiCpu />} label="Logic" />
            <FlowLine />
            <FlowNode icon={<FiDatabase />} label="Data" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeLine({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 whitespace-pre text-left" dir="ltr">
      <span className="w-4 shrink-0 select-none text-right text-faint/55">
        {n}
      </span>
      <span className="min-w-0 text-left">{children}</span>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-[0.66rem]">
      <FiCheckCircle className="text-success" size={12} />
      <span className="text-muted">{label}</span>
      <span className="ms-auto font-mono font-semibold text-primary-light">
        {value}
      </span>
    </div>
  );
}

function FlowNode({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1">
      <span className="grid h-8 w-8 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary-light shadow-[0_0_18px_rgba(79,124,255,0.22)]">
        {icon}
      </span>
      <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-wider text-faint">
        {label}
      </span>
    </div>
  );
}

function FlowLine() {
  return (
    <span className="h-px flex-1 bg-linear-to-r from-transparent via-primary/50 to-transparent" />
  );
}
