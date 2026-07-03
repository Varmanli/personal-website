import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { runProductionBootstrap } from "./production-bootstrap.mjs";

async function main() {
  await runProductionBootstrap();

  const serverEntry = path.resolve(process.cwd(), "server.js");
  const nextCli = path.resolve(
    process.cwd(),
    "node_modules",
    "next",
    "dist",
    "bin",
    "next",
  );
  const child = fs.existsSync(serverEntry)
    ? spawn(process.execPath, [serverEntry], {
        stdio: "inherit",
        env: process.env,
      })
    : spawn(process.execPath, [nextCli, "start"], {
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
