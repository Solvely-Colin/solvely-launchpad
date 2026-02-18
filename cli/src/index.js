import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PRESET_DIR = path.resolve(__dirname, '../presets/v1');
const REPO_REF = 'Solvely-Colin/solvely-launchpad';
const VERSION_REF = 'v1';

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) {
        out[key] = true;
      } else {
        out[key] = next;
        i += 1;
      }
    } else {
      out._.push(token);
    }
  }
  return out;
}

function loadPresets() {
  const files = fs.readdirSync(PRESET_DIR).filter((f) => f.endsWith('.json'));
  const presets = files.map((f) => JSON.parse(fs.readFileSync(path.join(PRESET_DIR, f), 'utf8')));
  return new Map(presets.map((p) => [p.id, p]));
}

function detectPackageManager(cwd) {
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

function detectPreset(cwd) {
  if (fs.existsSync(path.join(cwd, 'next.config.js')) || fs.existsSync(path.join(cwd, 'next.config.mjs'))) return 'nextjs';
  if (fs.existsSync(path.join(cwd, 'turbo.json'))) return 'turbo';
  if (fs.existsSync(path.join(cwd, 'pnpm-workspace.yaml'))) return 'pnpm-monorepo';
  if (fs.existsSync(path.join(cwd, 'pyproject.toml'))) return 'python';
  if (fs.existsSync(path.join(cwd, 'go.mod'))) return 'go';
  if (fs.existsSync(path.join(cwd, 'Cargo.toml'))) return 'rust';
  if (fs.existsSync(path.join(cwd, 'bun.lockb')) || fs.existsSync(path.join(cwd, 'bun.lock'))) return 'bun';
  return 'node-lib';
}

function renderCallerWorkflow(name, workflow, pm, overrides = {}) {
  const withPairs = Object.entries(overrides);
  const withLines = [pm ? `      package-manager: ${pm}` : null, ...withPairs.map(([k, v]) => `      ${k}: ${v}`)].filter(Boolean);
  const withBlock = withLines.length ? `\n    with:\n${withLines.join('\n')}` : '';
  return `name: ${name}\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\nconcurrency:\n  group: \${{ github.workflow }}-\${{ github.ref }}\n  cancel-in-progress: true\n\njobs:\n  ${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}:\n    uses: ${REPO_REF}/.github/workflows/${workflow}.yml@${VERSION_REF}${withBlock}\n`;
}

function renderScheduledWorkflow(pm) {
  return `name: Scheduled Maintenance\non:\n  schedule:\n    - cron: '0 9 * * 1'\n  workflow_dispatch:\n\njobs:\n  maintenance:\n    uses: ${REPO_REF}/.github/workflows/scheduled.yml@${VERSION_REF}\n    with:\n      package-manager: ${pm}\n`;
}

function renderReleaseWorkflow() {
  return `name: Release\non:\n  release:\n    types: [published]\njobs:\n  release:\n    uses: ${REPO_REF}/.github/workflows/release.yml@${VERSION_REF}\n    with:\n      package-name: your-package-name\n    secrets:\n      npm-token: \${{ secrets.NPM_TOKEN }}\n`;
}

function renderCommitlintConfig() {
  return `module.exports = {
  rules: {
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'header-max-length': [2, 'always', 100]
  }
};
`;
}

function renderCommitlintCallerWorkflow(strict) {
  return `name: Commitlint\non:\n  pull_request:\n    branches: [main]\njobs:\n  commitlint:\n    uses: ${REPO_REF}/.github/workflows/commitlint.yml@${VERSION_REF}\n    with:\n      strict: ${strict ? 'true' : 'false'}\n`;
}

function renderPolicy(preset) {
  return `version: 1\npreset: ${preset}\nchecks:\n  required: [ci, test]\n  license:\n    deny: [GPL-2.0, GPL-3.0]\n  security:\n    audit_level: critical\n    dependency_review: false\n    codeql: false\n    sbom: false\n    slsa_provenance: false\n    ossf_scorecard: false\npr_feedback:\n  enabled: true\n  mode: aggregated\n  flaky_hints: true\nbranches:\n  protected: [main]\n`;
}

function planFiles(cwd, preset, pm, writePolicy, commitlintStrict) {
  const files = [];
  const wfDir = path.join(cwd, '.github', 'workflows');
  const ciOverrides = preset.defaultOverrides || {};
  files.push({
    path: path.join(wfDir, 'ci.yml'),
    content: renderCallerWorkflow('CI', 'ci', pm, ciOverrides)
  });

  if (preset.requiredWorkflows.includes('commitlint')) {
    files.push({
      path: path.join(wfDir, 'commitlint.yml'),
      content: renderCommitlintCallerWorkflow(commitlintStrict)
    });
    files.push({
      path: path.join(cwd, 'commitlint.config.cjs'),
      content: renderCommitlintConfig()
    });
  }

  if (preset.requiredWorkflows.includes('coverage')) {
    files.push({
      path: path.join(wfDir, 'coverage.yml'),
      content: `name: Coverage\non:\n  push:\n    branches: [main]\njobs:\n  coverage:\n    uses: ${REPO_REF}/.github/workflows/coverage.yml@${VERSION_REF}\n    with:\n      package-manager: ${pm}\n`
    });
  }

  if (preset.requiredWorkflows.includes('release')) {
    files.push({ path: path.join(wfDir, 'release.yml'), content: renderReleaseWorkflow() });
  }

  if (preset.requiredWorkflows.includes('scheduled')) {
    files.push({ path: path.join(wfDir, 'scheduled.yml'), content: renderScheduledWorkflow(pm) });
  }

  if (writePolicy) {
    files.push({ path: path.join(cwd, '.citemplate.yml'), content: renderPolicy(preset.id) });
  }

  const readmePath = path.join(cwd, 'README.md');
  const snippet = '\n## CI/CD\n\nManaged by `solvely-launchpad`. Update with:\n\n```bash\nnpx solvely-launchpad migrate --from v1 --to v1.x\n```\n';
  if (fs.existsSync(readmePath)) {
    const curr = fs.readFileSync(readmePath, 'utf8');
    if (!curr.includes('Managed by `solvely-launchpad`')) {
      files.push({ path: readmePath, content: `${curr.trimEnd()}${snippet}\n` });
    }
  }

  return files;
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeFiles(files) {
  for (const f of files) {
    ensureDir(f.path);
    fs.writeFileSync(f.path, f.content, 'utf8');
  }
}

function printPlan(files) {
  for (const f of files) {
    const exists = fs.existsSync(f.path);
    const status = exists ? 'update' : 'create';
    console.log(`${status}: ${path.relative(process.cwd(), f.path)}`);
  }
}

function runGit(cmd, args, cwd) {
  const res = spawnSync(cmd, args, { cwd, stdio: 'inherit' });
  if (res.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(' ')}`);
  }
}

async function askPreset(presets, suggested) {
  const keys = [...presets.keys()];
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = () => new Promise((resolve) => rl.question(`Preset [${keys.join(', ')}] (default ${suggested}): `, resolve));
  const answer = (await question()).trim();
  rl.close();
  if (!answer) return suggested;
  return answer;
}

function parseTopLevelKeys(yamlContent) {
  return yamlContent
    .split('\n')
    .filter((line) => line && !line.startsWith(' ') && line.includes(':'))
    .map((line) => line.split(':')[0].trim());
}

function commandDoctor(cwd) {
  const file = path.join(cwd, '.citemplate.yml');
  const warnings = [];
  if (!fs.existsSync(file)) {
    console.log('WARN: .citemplate.yml not found. Run init with --policy true to generate it.');
    return;
  }

  const policy = fs.readFileSync(file, 'utf8');
  const required = ['version:', 'preset:'];
  for (const r of required) {
    if (!policy.includes(r)) {
      throw new Error(`Missing required policy key: ${r.replace(':', '')}`);
    }
  }

  const allowed = new Set(['version', 'preset', 'checks', 'pr_feedback', 'branches']);
  const keys = parseTopLevelKeys(policy);
  for (const k of keys) {
    if (!allowed.has(k)) warnings.push(`Unknown top-level key: ${k}`);
  }

  const ciPath = path.join(cwd, '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(ciPath)) throw new Error('Missing .github/workflows/ci.yml');

  const commitlintCallerPath = path.join(cwd, '.github', 'workflows', 'commitlint.yml');
  const commitlintConfigPath = path.join(cwd, 'commitlint.config.cjs');
  if (fs.existsSync(commitlintCallerPath) && !fs.existsSync(commitlintConfigPath)) {
    warnings.push('Missing commitlint.config.cjs while commitlint workflow is enabled.');
  }

  for (const w of warnings) console.log(`WARN: ${w}`);
  console.log('OK: policy + workflow baseline checks passed.');
}

function commandMigrate(cwd) {
  const wfDir = path.join(cwd, '.github', 'workflows');
  if (!fs.existsSync(wfDir)) {
    console.log('No workflows found to migrate.');
    return;
  }
  for (const file of fs.readdirSync(wfDir)) {
    const full = path.join(wfDir, file);
    const content = fs.readFileSync(full, 'utf8');
    const next = content.replace(/@main/g, '@v1');
    if (next !== content) fs.writeFileSync(full, next, 'utf8');
  }
  console.log('Migration complete: replaced @main with @v1 where applicable.');
}

export async function run(argv) {
  const args = parseArgs(argv);
  const cmd = args._[0] || 'init';
  const cwd = process.cwd();
  const presets = loadPresets();

  if (cmd === 'doctor') {
    commandDoctor(cwd);
    return;
  }

  if (cmd === 'migrate') {
    commandMigrate(cwd);
    return;
  }

  const detectedPreset = detectPreset(cwd);
  const selectedPreset = args.preset || ((args.yes || !process.stdin.isTTY) ? detectedPreset : await askPreset(presets, detectedPreset));
  const preset = presets.get(selectedPreset);
  if (!preset) throw new Error(`Unknown preset: ${selectedPreset}`);

  const pm = args['package-manager'] || detectPackageManager(cwd);
  const commitlintStrict = String(args['commitlint-strict'] || 'false').toLowerCase() === 'true';
  const files = planFiles(cwd, preset, pm, args.policy !== 'false', commitlintStrict);

  if (cmd === 'preview') {
    printPlan(files);
    return;
  }

  if (cmd !== 'init') {
    throw new Error(`Unknown command: ${cmd}`);
  }

  printPlan(files);
  writeFiles(files);
  console.log('Generated CI template files.');

  if (args.branch) {
    runGit('git', ['checkout', '-b', args.branch], cwd);
  }

  if (args.commit) {
    const addTargets = [...new Set(files.map((f) => path.relative(cwd, f.path)))];
    runGit('git', ['add', ...addTargets], cwd);
    runGit('git', ['commit', '-m', typeof args.commit === 'string' ? args.commit : 'chore(ci): bootstrap launchpad'], cwd);
  }

  if (args.push && args.branch) {
    runGit('git', ['push', '-u', 'origin', args.branch], cwd);
  }

  if (args['open-pr']) {
    runGit('gh', ['pr', 'create', '--fill'], cwd);
  }
}
