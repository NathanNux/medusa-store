#!/usr/bin/env node
/**
 * Local wait script that prefers MEDUSA_BACKEND_URL over NEXT_PUBLIC_MEDUSA_BACKEND_URL
 * and can read .env.local before Next.js starts.
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Minimal .env loader for .env.local (no quotes/expansions), best-effort
function loadDotenvLocal() {
  const envPath = path.resolve(__dirname, '../.env.local');
  try {
    const data = fs.readFileSync(envPath, 'utf8');
    const lines = data.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      if (!(key in process.env)) {
        // strip optional surrounding quotes
        const unquoted = val.replace(/^\"|\"$/g, '').replace(/^'|'$/g, '');
        process.env[key] = unquoted;
      }
    }
  } catch (_) {
    // ignore if file not found
  }
}

async function checkBackend(url, timeoutSec = 1200) {
  const deadline = Date.now() + timeoutSec * 1000;
  let printedUrl = false;
  while (Date.now() < deadline) {
    const elapsed = Math.floor((timeoutSec * 1000 - (deadline - Date.now())) / 1000);
    try {
      const res = await axios.get(url);
      if (res.status === 200) {
        console.log('Backend is ready!');
        return;
      }
    } catch (_) {
      // keep trying
    }
    if (!printedUrl) {
      console.log(`Waiting for a medusajs backend to be available on ${url}... Elapsed time: ${elapsed} seconds`);
      printedUrl = true;
    } else {
      console.log(`... Elapsed time: ${elapsed} seconds`);
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error(`Timeout: Backend was not ready within ${timeoutSec} seconds.`);
}

async function main() {
  loadDotenvLocal();
  // Prefer server-side var, then public one
  const base = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
  const url = `${base.replace(/\/$/, '')}/key-exchange`;
  try {
    await checkBackend(url);
    process.exit(0);
  } catch (err) {
    console.error('Error waiting for backend:', err.message || err);
    process.exit(1);
  }
}

main();
