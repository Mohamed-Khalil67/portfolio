#!/usr/bin/env node
/**
 * Scans src/assets/assignments/* and regenerates src/app/data/assignments.data.ts.
 *
 * Two folder layouts are supported and may be mixed freely:
 *
 *   A) Root-level project (legacy):
 *      src/assets/assignments/<ProjectName>/index.html
 *      → category from meta.json, defaults to "route-assignments"
 *
 *   B) Category bucket (auto-categorized by folder name):
 *      src/assets/assignments/<category-folder>/<ProjectName>/index.html
 *      → category is derived from the parent folder name via CATEGORY_FOLDER_MAP.
 *        Anything inside "landing-pages/", "front-end-projects/", or
 *        "full-stack-projects/" is auto-tagged. meta.json category is ignored
 *        when the project lives under a category bucket.
 *
 * Each assignment folder may contain a meta.json:
 *   {
 *     "title":       "CSS Flexbox Layout",
 *     "description": "Short description.",
 *     "tags":        ["HTML", "CSS"],
 *     "color":       "#f093fb, #f5576c",
 *     "category":    "route-assignments"  // ignored if inside a category bucket
 *   }
 *
 * Valid category values: "route-assignments" | "frontend" | "fullstack"
 *
 * Folders without an index.html are skipped. Folders without a meta.json
 * still appear with sensible defaults derived from the folder name.
 *
 * Run automatically via "prestart" / "prebuild" hooks in package.json.
 *
 * Watch mode uses chokidar for reliable cross-platform file watching.
 * Install it once: npm install --save-dev chokidar
 */

const fs = require('fs');
const path = require('path');

// ─── Constants ───────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..');
const ASSIGNMENTS_DIR = path.join(ROOT, 'src', 'assets', 'ALL');
const URL_BASE = 'assets/ALL';
const OUTPUT_FILE = path.join(
  ROOT,
  'src',
  'app',
  'data',
  'assignments.data.ts',
);

const VALID_CATEGORIES = new Set([
  'route-assignments',
  'frontend',
  'fullstack',
]);

/**
 * Maps a category-bucket folder name (case-insensitive) to a category key.
 * Add aliases here when introducing new bucket names — no other changes needed.
 */
const CATEGORY_FOLDER_MAP = {
  'landing-pages': 'route-assignments',
  'landing-page':  'route-assignments',
  'landings':      'route-assignments',
  'route-assignments': 'route-assignments',

  'front-end-projects': 'frontend',
  'frontend-projects':  'frontend',
  'front-end':          'frontend',
  'frontend':           'frontend',

  'full-stack-projects': 'fullstack',
  'fullstack-projects':  'fullstack',
  'full-stack':          'fullstack',
  'fullstack':           'fullstack',
};

/**
 * File extensions that are automatically picked up as downloadable assets.
 * Add more here (e.g. 'app.js', 'main.ts') without touching scanFolder().
 */
const KNOWN_ASSET_FILENAMES = [
  'style.css',
  'styles.css',
  'script.js',
  'scripts.js',
  'main.js',
  'app.js',
  'main.ts',
  'app.ts',
];

const COLOR_PALETTE = [
  '#f093fb, #f5576c',
  '#4facfe, #00f2fe',
  '#43e97b, #38f9d7',
  '#fa709a, #fee140',
  '#a18cd1, #fbc2eb',
  '#fd7043, #ff8a65',
  '#a1c4fd, #c2e9fb',
  '#f6d365, #fda085',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const titleCase = (slug) =>
  slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const safeReadJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    if (err.code !== 'ENOENT') {
      // File exists but failed to parse — warn the developer
      console.warn(
        `[generate-assignments] Warning: Could not parse ${file}: ${err.message}`,
      );
    }
    return null;
  }
};

// ─── Core logic ──────────────────────────────────────────────────────────────

/**
 * @param relPath  Path relative to ASSIGNMENTS_DIR using forward slashes,
 *                 e.g. "FitCoreGymLanding" or "landing-pages/FitCoreGymLanding".
 * @param colorIndex   Index into COLOR_PALETTE for the default accent color.
 * @param forcedCategory  When set (project lives in a category bucket), this
 *                        wins over any meta.json `category` field.
 */
const scanFolder = (relPath, colorIndex, forcedCategory = null) => {
  const folderPath = path.join(ASSIGNMENTS_DIR, ...relPath.split('/'));
  const folderName = path.basename(relPath);
  const indexHtml = path.join(folderPath, 'index.html');

  if (!fs.existsSync(indexHtml)) {
    console.warn(
      `[generate-assignments] Skipping "${relPath}" — no index.html found.`,
    );
    return null;
  }

  const meta = safeReadJson(path.join(folderPath, 'meta.json')) ?? {};

  // ── Resolve category ───────────────────────────────────────────────────────
  // Bucket folder wins over meta.json so the file layout is the source of truth.
  let category = forcedCategory ?? meta.category ?? 'route-assignments';
  if (!VALID_CATEGORIES.has(category)) {
    console.warn(
      `[generate-assignments] Warning: "${relPath}" has unknown category "${category}". ` +
        `Falling back to "route-assignments". Valid values: ${[...VALID_CATEGORIES].join(', ')}.`,
    );
    category = 'route-assignments';
  }

  const urlBase = `${URL_BASE}/${relPath}`;
  const id = folderName;
  const title = meta.title ?? titleCase(folderName);
  const description = meta.description ?? '';
  const tags =
    Array.isArray(meta.tags) && meta.tags.length ? meta.tags : ['HTML'];
  const color = meta.color ?? COLOR_PALETTE[colorIndex % COLOR_PALETTE.length];
  const previewUrl = `${urlBase}/index.html`;

  // ── Collect downloadable files ─────────────────────────────────────────────
  // Always include index.html, then scan for any known asset filenames.
  const downloadFiles = [{ name: 'index.html', url: `${urlBase}/index.html` }];

  for (const filename of KNOWN_ASSET_FILENAMES) {
    if (fs.existsSync(path.join(folderPath, filename))) {
      downloadFiles.push({
        name: filename,
        url: `${urlBase}/${filename}`,
      });
    }
  }

  return {
    id,
    title,
    description,
    tags,
    previewUrl,
    downloadFiles,
    color,
    category,
  };
};

/**
 * Returns the list of project relPaths to scan, walking one level into
 * any folder whose name matches a known category bucket.
 */
const discoverProjects = () => {
  const top = fs
    .readdirSync(ASSIGNMENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const projects = [];
  for (const name of top) {
    const bucketKey = CATEGORY_FOLDER_MAP[name.toLowerCase()];
    if (bucketKey) {
      // Category bucket — every subfolder inside becomes a project.
      const bucketPath = path.join(ASSIGNMENTS_DIR, name);
      const inner = fs
        .readdirSync(bucketPath, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .sort();
      for (const sub of inner) {
        projects.push({ relPath: `${name}/${sub}`, category: bucketKey });
      }
    } else {
      projects.push({ relPath: name, category: null });
    }
  }
  return projects;
};

const renderAssignment = (a) => {
  const lines = [
    '  {',
    `    id: ${JSON.stringify(a.id)},`,
    `    title: ${JSON.stringify(a.title)},`,
    `    description: ${JSON.stringify(a.description)},`,
  ];
  lines.push(`    tags: ${JSON.stringify(a.tags)},`);
  lines.push(`    previewUrl: ${JSON.stringify(a.previewUrl)},`);
  lines.push('    downloadFiles: [');
  for (const f of a.downloadFiles) {
    lines.push(
      `      { name: ${JSON.stringify(f.name)}, url: ${JSON.stringify(f.url)} },`,
    );
  }
  lines.push('    ],');
  lines.push(`    color: ${JSON.stringify(a.color)},`);
  lines.push(`    category: ${JSON.stringify(a.category)},`);
  lines.push('  },');
  return lines.join('\n');
};

const main = () => {
  try {
    if (!fs.existsSync(ASSIGNMENTS_DIR)) {
      throw new Error(`Missing assignments folder: ${ASSIGNMENTS_DIR}`);
    }

    const projects = discoverProjects();

    const assignments = projects
      .map((p, i) => scanFolder(p.relPath, i, p.category))
      .filter(Boolean);

    const body = assignments.map(renderAssignment).join('\n');

    const output = `// AUTO-GENERATED by scripts/generate-assignments.js
// Do not edit by hand — modify src/assets/assignments/<folder>/meta.json instead.

import { Assignment } from '../models/assignment.model';

export const ASSIGNMENTS: Assignment[] = [
${body}
];
`;

    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, output, 'utf8');

    console.log(
      `[generate-assignments] ✔ Wrote ${assignments.length} assignment(s) → ` +
        path.relative(ROOT, OUTPUT_FILE),
    );
  } catch (err) {
    console.error(`[generate-assignments] ✖ Error: ${err.message}`);
    process.exit(1);
  }
};

// ─── Entry point ─────────────────────────────────────────────────────────────

if (process.argv.includes('--watch')) {
  // Prefer chokidar for reliable cross-platform watching.
  // Falls back to fs.watch with a warning if chokidar isn't installed.
  let chokidar;
  try {
    chokidar = require('chokidar');
  } catch {
    chokidar = null;
  }

  main();

  if (chokidar) {
    console.log(
      '[generate-assignments] Watching src/assets/assignments/ for changes… (chokidar)',
    );

    chokidar
      .watch(ASSIGNMENTS_DIR, {
        ignoreInitial: true,
        awaitWriteFinish: { stabilityThreshold: 300, pollInterval: 100 },
      })
      .on('all', (event, filePath) => {
        console.log(
          `[generate-assignments] ${event}: ${path.relative(ROOT, filePath)} — rescanning…`,
        );
        main();
      });
  } else {
    console.warn(
      '[generate-assignments] chokidar not found — falling back to fs.watch (less reliable).\n' +
        '  Install it for better watch support: npm install --save-dev chokidar',
    );

    let debounce = null;
    fs.watch(ASSIGNMENTS_DIR, { recursive: true }, (_event, filename) => {
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(() => {
        console.log(
          `[generate-assignments] Change detected (${filename ?? '?'}) — rescanning…`,
        );
        main();
      }, 300);
    });
  }
} else {
  main();
}
