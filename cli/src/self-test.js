import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BIN = path.resolve(__dirname, '../bin/launchpad.js');

function runCli(args, cwd) {
  const res = spawnSync('node', [BIN, ...args], {
    cwd,
    encoding: 'utf8'
  });
  return res;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'launchpad-self-test-'));
}

function main() {
  const tmp = makeTempDir();

  writeJson(path.join(tmp, 'package.json'), {
    name: 'self-test-repo',
    private: true,
    version: '1.0.0',
    scripts: {
      test: 'echo ok',
      lint: 'echo lint',
      build: 'echo build'
    }
  });

  let res = runCli(['init', '--preset', 'node-lib', '--yes'], tmp);
  assert(res.status === 0, `init failed:\n${res.stdout}\n${res.stderr}`);

  const callerCiPath = path.join(tmp, '.github', 'workflows', 'ci.yml');
  const callerCi = fs.readFileSync(callerCiPath, 'utf8');
  assert(callerCi.includes('permissions:'), 'generated caller workflow missing permissions block');
  assert(callerCi.includes('contents: read'), 'generated caller workflow missing contents: read');
  assert(callerCi.includes('pull-requests: write'), 'generated caller workflow missing pull-requests: write');
  assert(callerCi.includes('@v1'), 'generated caller workflow missing @v1 pin');

  fs.writeFileSync(callerCiPath, callerCi.replace('contents: read\n  pull-requests: write\n', ''), 'utf8');
  fs.writeFileSync(
    callerCiPath,
    fs.readFileSync(callerCiPath, 'utf8').replace('/ci.yml@v1', '/ci.yml@main'),
    'utf8'
  );

  res = runCli(['doctor'], tmp);
  assert(res.status === 0, `doctor failed unexpectedly:\n${res.stdout}\n${res.stderr}`);
  assert(
    res.stdout.includes('Minimum caller contract missing `permissions.contents: read`'),
    `doctor did not warn on missing permissions:\n${res.stdout}`
  );
  assert(
    res.stdout.includes('Detected `@main` reusable workflow ref'),
    `doctor did not warn on @main workflow refs:\n${res.stdout}`
  );

  const policy = fs.readFileSync(path.join(tmp, '.citemplate.yml'), 'utf8');
  fs.writeFileSync(
    path.join(tmp, '.citemplate.yml'),
    policy.replace('dependency_review: false', 'dependency_review: true'),
    'utf8'
  );
  res = runCli(['doctor'], tmp);
  assert(res.status === 0, `doctor failed unexpectedly on quality-gates check:\n${res.stdout}\n${res.stderr}`);
  assert(
    res.stdout.includes('Policy enables quality gates, but no caller workflow references `quality-gates.yml` directly.'),
    `doctor did not warn on missing direct quality-gates caller wiring:\n${res.stdout}`
  );

  const tmpNoPkg = makeTempDir();
  res = runCli(['preview', '--preset', 'node-lib', '--yes'], tmpNoPkg);
  assert(res.status === 0, `preview failed:\n${res.stdout}\n${res.stderr}`);
  assert(
    res.stdout.includes('Note: skipping release workflow (no package.json detected).'),
    `preview missing non-package release note:\n${res.stdout}`
  );

  console.log('CLI self-test passed.');
}

try {
  main();
} catch (error) {
  console.error(`CLI self-test failed: ${error.message}`);
  process.exit(1);
}
