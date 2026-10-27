#!/usr/bin/env node
// npx entry point: runs portless-herd.sh (macOS/Linux) or portless-herd.ps1 (Windows).
'use strict';
const { spawnSync } = require('node:child_process');
const { join } = require('node:path');

const root = join(__dirname, '..');
const args = process.argv.slice(2);
const win = process.platform === 'win32';

const [cmd, cmdArgs] = win
  ? ['powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', join(root, 'portless-herd.ps1'), ...args]]
  : ['bash', [join(root, 'portless-herd.sh'), ...args]];

const r = spawnSync(cmd, cmdArgs, {
  stdio: 'inherit',
  env: { ...process.env, PORTLESS_HERD_CMD: process.env.PORTLESS_HERD_CMD || 'npx github:ym-scripts/portless-x-herd' },
});
if (r.error) {
  console.error(`Could not start ${cmd}: ${r.error.message}`);
  process.exit(1);
}
process.exit(r.status ?? 1);
