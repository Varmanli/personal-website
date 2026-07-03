import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function isBootstrapEnabled() {
  return process.env.RUN_DB_BOOTSTRAP_ON_START === "true";
}

function isFailHardEnabled() {
  return process.env.DB_BOOTSTRAP_FAIL_HARD === "true";
}

async function maybeRunBootstrap() {
  if (!isBootstrapEnabled()) {
    console.log("[start] RUN_DB_BOOTSTRAP_ON_START is not 'true'. Skipping startup bootstrap.");
    return;
  }

  try {
    const mod = await import("./production-bootstrap.mjs");
    await mod.runProductionBootstrap();
  } catch (error) {
    console.error("[start] Startup bootstrap failed.", error);
    if (isFailHardEnabled()) {
      throw error;
    }
    console.warn("[start] Continuing startup because DB_BOOTSTRAP_FAIL_HARD is not 'true'.");
  }
}

async function main() {
  await maybeRunBootstrap();

  const serverEntry = path.resolve(process.cwd(), "server.js");
  const standaloneServerEntry = path.resolve(
    process.cwd(),
    ".next",
    "standalone",
    "server.js",
  );
  const nextCli = path.resolve(
    process.cwd(),
    "node_modules",
    "next",
    "dist",
    "bin",
    "next",
  );
  const entry =
    fs.existsSync(serverEntry)
      ? [process.execPath, [serverEntry]]
      : fs.existsSync(standaloneServerEntry)
        ? [process.execPath, [standaloneServerEntry]]
        : [process.execPath, [nextCli, "start"]];

  const child = spawn(entry[0], entry[1], {
        stdio: "inherit",
        env: process.env,
      });

  const forward = (signal) => {
    if (!child.killed) child.kill(signal);
  };

  process.on("SIGINT", forward);
  process.on("SIGTERM", forward);

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error("[start] Production startup failed before Next.js boot.", error);
  process.exit(1);
});
