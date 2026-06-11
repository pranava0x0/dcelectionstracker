// One-off merge tool: folds researched candidate positions (JSON) into
// src/data/elections.ts. Existing positions are never overwritten — only
// missing issue keys are added. Usage:
//   node scripts/merge-positions.mjs positions-mayor.json [more.json ...]
// JSON shape: { "<candidate-slug>": { "<issue-slug>": { stance, sourceLabel, sourceUrl } } }
// Keys starting with "_" (e.g. "_sites") are ignored.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const FILE = fileURLToPath(new URL("../src/data/elections.ts", import.meta.url));
const ISSUES = ["statehood", "public-safety", "housing", "budget", "transportation", "schools"];

let src = readFileSync(FILE, "utf8");
const merged = {};
for (const path of process.argv.slice(2)) {
  const data = JSON.parse(readFileSync(path, "utf8"));
  for (const [slug, positions] of Object.entries(data)) {
    if (slug.startsWith("_")) continue;
    merged[slug] = { ...(merged[slug] ?? {}), ...positions };
  }
}

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const issueKey = (slug) => (slug.includes("-") ? `"${slug}"` : slug);

// Render one `issue: { stance, sourceLabel, sourceUrl },` block at the given indent.
function renderEntry(issue, p, indent) {
  return (
    `${indent}${issueKey(issue)}: {\n` +
    `${indent}  stance: "${esc(p.stance)}",\n` +
    `${indent}  sourceLabel: "${esc(p.sourceLabel)}",\n` +
    `${indent}  sourceUrl: "${esc(p.sourceUrl)}",\n` +
    `${indent}},\n`
  );
}

// Find the extent of the candidate object that contains `slug: "<slug>"` by
// brace-matching from the object's opening `{`.
function candidateRange(slug) {
  const marker = `slug: "${slug}"`;
  const at = src.indexOf(marker);
  if (at === -1) return null;
  const open = src.lastIndexOf("{", at);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) return { open, close: i };
    }
  }
  return null;
}

let added = 0;
let skippedExisting = 0;
const report = [];
for (const [slug, positions] of Object.entries(merged)) {
  const range = candidateRange(slug);
  if (!range) {
    report.push(`!! unknown candidate slug: ${slug}`);
    continue;
  }
  let body = src.slice(range.open, range.close + 1);
  const valid = Object.entries(positions).filter(([issue, p]) => {
    if (!ISSUES.includes(issue)) {
      report.push(`!! ${slug}: unknown issue ${issue}`);
      return false;
    }
    if (!p?.stance || !/^https?:\/\//.test(p?.sourceUrl ?? "") || !p?.sourceLabel) {
      report.push(`!! ${slug}/${issue}: missing stance/source fields`);
      return false;
    }
    if (p.stance.trim().split(/\s+/).length > 30) {
      report.push(`!! ${slug}/${issue}: stance over 30 words, trim manually: ${p.stance}`);
      return false;
    }
    return true;
  });

  const posAt = body.search(/\n(\s*)positions: \{/);
  if (posAt !== -1) {
    // Existing positions block: append only issues not already present.
    const indentMatch = body.match(/\n(\s*)positions: \{/);
    const indent = indentMatch[1] + "  ";
    const blockOpen = body.indexOf("{", posAt + 1);
    let depth = 0;
    let blockClose = -1;
    for (let i = blockOpen; i < body.length; i++) {
      if (body[i] === "{") depth++;
      else if (body[i] === "}") {
        depth--;
        if (depth === 0) { blockClose = i; break; }
      }
    }
    const blockText = body.slice(blockOpen, blockClose);
    let insert = "";
    for (const [issue, p] of valid) {
      if (new RegExp(`(^|[\\s{])${issueKey(issue).replace(/"/g, '\\"')}:`).test(blockText)) {
        skippedExisting++;
        continue;
      }
      insert += renderEntry(issue, p, indent);
      added++;
    }
    if (insert) {
      // Insert just before the block's closing brace line.
      const before = body.slice(0, blockClose);
      const after = body.slice(blockClose);
      const needsNL = before.endsWith("\n") ? "" : "\n";
      body = before + needsNL + insert + indentMatch[1] + after.replace(/^\s*/, "");
    }
  } else if (valid.length > 0) {
    // No positions block yet: insert one right after the `source: {...},` line.
    const srcLine = body.match(/\n(\s*)source: \{[^}]*\},\n/);
    if (!srcLine) {
      report.push(`!! ${slug}: couldn't find source line to anchor positions block`);
      continue;
    }
    const indent = srcLine[1];
    let block = `${indent}positions: {\n`;
    for (const [issue, p] of valid) {
      block += renderEntry(issue, p, indent + "  ");
      added++;
    }
    block += `${indent}},\n`;
    const at = body.indexOf(srcLine[0]) + srcLine[0].length;
    body = body.slice(0, at) + block + body.slice(at);
  }
  src = src.slice(0, range.open) + body + src.slice(range.close + 1);
}

writeFileSync(FILE, src);
console.log(`added ${added} positions, skipped ${skippedExisting} already present`);
for (const r of report) console.log(r);
