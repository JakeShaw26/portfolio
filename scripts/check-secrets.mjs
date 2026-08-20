#!/usr/bin/env node
/**
 * Fails if the diff being committed or pushed contains a probable secret.
 *
 * Why this exists alongside GitHub push protection: confirmed during the
 * 2026-08-20 research pass that non-provider-pattern matching is OFF on this
 * repo, and this repo's real secret shape — a Contentful Content Delivery
 * API token — is an unprefixed opaque string, not a pattern any provider
 * scanner recognises. Push protection also only runs server-side, after the
 * commit object already exists; this runs before that, in the diff.
 *
 * Three checks, each aimed at a different failure mode:
 *
 *   1. `.env*` filenames staged/pushed (excluding the committed template,
 *      `.env.example`) — catches the whole file being added by accident.
 *   2. `CONTENTFUL_*_TOKEN`/`_KEY`/`_SECRET`-shaped assignments with a real
 *      value — catches a token pasted directly into source, docs, or CI
 *      config instead of read from the environment. Restricted to
 *      token/key/secret-shaped names (not any `CONTENTFUL_*`) so it doesn't
 *      trip on `CONTENTFUL_ENVIRONMENT=master` in the committed
 *      `.env.example`, which is a real, intentional, non-secret value.
 *   3. High-entropy bare tokens — catches a secret pasted with no
 *      recognisable variable name at all. The Contentful space ID
 *      (`98ddc4l0fmm4`, already public in `.env.example` and `ci.yml`) is
 *      allowlisted explicitly so it never trips this.
 *
 * Usage:
 *   node scripts/check-secrets.mjs              scan the staged diff (git diff --cached)
 *   node scripts/check-secrets.mjs --pre-push    scan the commit range(s) about to be
 *                                                 pushed, read from stdin per git's
 *                                                 pre-push hook contract
 *   node scripts/check-secrets.mjs --range A..B  scan an explicit git diff range
 *                                                 (ad-hoc / manual auditing)
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

// Documented non-secret, already public — see .env.example and ci.yml.
const ALLOWLISTED_VALUES = new Set(["98ddc4l0fmm4"]);

const ENV_FILE_PATTERN = /(^|\/)\.env(\.|$)/i;
const ENV_FILE_ALLOWLIST = /\.env\.(example|sample|template|dist)$/i;

// Restricted to names that actually read as a secret. A bare `CONTENTFUL_*`
// match would also fire on `CONTENTFUL_ENVIRONMENT=master` and
// `CONTENTFUL_SPACE_ID=` in the committed .env.example. Case-insensitive and
// underscore-optional so it catches both env-var style (CONTENTFUL_DELIVERY_TOKEN)
// and a JS variable holding the same value (contentfulDeliveryToken) — the
// original SCREAMING_SNAKE_CASE-only version missed the latter entirely.
const CONTENTFUL_SECRET_ASSIGNMENT =
  /\bcontentful[a-z0-9_]*(?:token|key|secret)\s*[:=]\s*["'`]?([^\s"'`]{6,})/i;

const HIGH_ENTROPY_TOKEN = /[A-Za-z0-9_\-+/]{24,}/g;
// Random opaque tokens sit well above natural language / code identifiers,
// which rarely clear ~3.5 bits/char even at length. Tuned against this
// repo's own history — see subtask 2's test notes in the PR description.
const ENTROPY_THRESHOLD = 4.0;

// Lockfiles and generated/binary-ish files legitimately contain long,
// high-entropy tokens (integrity hashes, source-map mappings) that are not
// secrets and would otherwise dominate false positives.
const SKIP_FILES = [
  /package-lock\.json$/,
  /pnpm-lock\.yaml$/,
  /yarn\.lock$/,
  /\.map$/i,
  /\.svg$/i,
  /\.ico$/i,
  /\.(png|jpe?g|webp|avif|gif)$/i,
];

function run(args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 64,
  });
}

function shannonEntropy(str) {
  const counts = new Map();
  for (const ch of str) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  let entropy = 0;
  for (const count of counts.values()) {
    const p = count / str.length;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

// git SHA-1 (40 hex chars) and SHA-256 (64 hex chars) — the two lengths a
// SHA-pinned GitHub Action ref or a git commit SHA actually appears at in
// this repo's diffs.
const HEX_SHA_LENGTHS = new Set([40, 64]);

function isSuspiciousToken(token) {
  if (ALLOWLISTED_VALUES.has(token)) return false;

  if (/^[0-9a-f]+$/i.test(token)) {
    // Hex-only tokens at exactly a SHA-1/SHA-256 length (git SHAs,
    // SHA-pinned Action refs — this repo pins every Action to a full commit
    // SHA by policy) are a dominant, benign source of long tokens in this
    // repo's own diffs. Excluded only at those specific lengths.
    if (HEX_SHA_LENGTHS.has(token.length)) return false;
    // Any other hex-shaped token of qualifying length is flagged directly,
    // not run through the entropy check below: a 16-symbol alphabet caps
    // Shannon entropy at exactly 4.0 bits/char, so real hex secrets almost
    // never reach the >= 4.0 threshold that check uses (it's calibrated for
    // richer base62/base64-shaped tokens) — routing hex through it would
    // silently exempt the entire class again in practice, just less overtly.
    return true;
  }

  if (/^\d+$/.test(token)) return false;
  return shannonEntropy(token) >= ENTROPY_THRESHOLD;
}

function stagedFileNames() {
  return run(["diff", "--cached", "--name-only", "--diff-filter=ACM"])
    .split("\n")
    .filter(Boolean);
}

function stagedDiffText() {
  return run(["diff", "--cached"]);
}

function rangeFileNames(range) {
  return run(["diff", "--name-only", "--diff-filter=ACM", range])
    .split("\n")
    .filter(Boolean);
}

function rangeDiffText(range) {
  return run(["diff", range]);
}

// Git's well-known empty-tree object hash — exists in every repo without
// being written anywhere, since it's the hash of an empty tree object by
// definition. Diffing against it yields the full accumulated diff of every
// change up to a commit, which is what "scan this ref's full history"
// actually requires.
const EMPTY_TREE_SHA = "4b825dc642cb6eb9a060e54bf8d69288fbee4904";

function mergeBaseRange(localSha, remoteRef) {
  try {
    const base = run(["merge-base", localSha, remoteRef]).trim();
    return `${base}..${localSha}`;
  } catch {
    // No common history with the reference branch (e.g. it doesn't exist
    // locally either) — diff from the empty tree so the full history of
    // this ref is scanned. Rare; only hit on a from-scratch push with no
    // local main to compare.
    //
    // NOT `${localSha}` alone: `git diff <single-sha>` compares that commit
    // against the current working tree, not against the ref's own history —
    // on a clean checkout that's an empty diff, so this fallback would
    // silently scan nothing on exactly the case it exists to handle.
    return `${EMPTY_TREE_SHA}..${localSha}`;
  }
}

/** Parses stdin per git's pre-push hook contract: `<local ref> <local sha> <remote ref> <remote sha>` per line. */
function parsePrePushStdin(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [localRef, localSha, remoteRef, remoteSha] = line.split(/\s+/);
      return { localRef, localSha, remoteRef, remoteSha };
    });
}

function collectRangesFromPrePush(updates) {
  const ranges = [];
  for (const { localSha, remoteSha } of updates) {
    if (!localSha || /^0+$/.test(localSha)) continue; // branch deletion — nothing pushed
    if (remoteSha && !/^0+$/.test(remoteSha)) {
      ranges.push(`${remoteSha}..${localSha}`);
    } else {
      // New ref: diff against where it branched from origin/main, not the
      // whole history, so already-merged commits aren't re-scanned every push.
      ranges.push(mergeBaseRange(localSha, "origin/main"));
    }
  }
  return ranges;
}

function scanFileNames(fileNames) {
  const hits = [];
  for (const file of fileNames) {
    if (ENV_FILE_ALLOWLIST.test(file)) continue;
    if (ENV_FILE_PATTERN.test(file)) {
      hits.push({ kind: "env-file", detail: file });
    }
  }
  return hits;
}

function scanDiffText(diffText) {
  const hits = [];
  let currentFile = null;
  let skipCurrent = false;

  for (const line of diffText.split("\n")) {
    if (line.startsWith("+++ ")) {
      currentFile = line.slice(6).replace(/^b\//, "");
      skipCurrent = SKIP_FILES.some((re) => re.test(currentFile));
      continue;
    }
    if (!line.startsWith("+") || line.startsWith("+++")) continue;
    if (skipCurrent) continue;

    const added = line.slice(1);

    const secretMatch = added.match(CONTENTFUL_SECRET_ASSIGNMENT);
    if (secretMatch && !ALLOWLISTED_VALUES.has(secretMatch[1])) {
      hits.push({
        kind: "contentful-assignment",
        detail: `${currentFile ?? "(unknown file)"}: ${added.trim().slice(0, 120)}`,
      });
    }

    for (const token of added.match(HIGH_ENTROPY_TOKEN) ?? []) {
      if (isSuspiciousToken(token)) {
        hits.push({
          kind: "high-entropy",
          detail: `${currentFile ?? "(unknown file)"}: ${token.slice(0, 12)}… (entropy ${shannonEntropy(token).toFixed(2)}, length ${token.length})`,
        });
      }
    }
  }

  return hits;
}

function report(hits) {
  if (hits.length === 0) {
    console.log("No probable secrets found.");
    return 0;
  }

  console.error(`\nProbable secret(s) found (${hits.length}):\n`);
  for (const hit of hits) {
    console.error(`  [${hit.kind}] ${hit.detail}`);
  }
  console.error(
    "\nIf this is a false positive (e.g. a new non-secret constant), " +
      "allowlist it explicitly in scripts/check-secrets.mjs with a comment " +
      "explaining why it's safe — don't just re-run past this.\n" +
      "If it's real: unstage/remove it, rotate the credential if it was ever " +
      "pushed, and re-commit without it.\n",
  );
  return 1;
}

function main() {
  const isPrePush = process.argv.includes("--pre-push");
  const rangeArgIndex = process.argv.indexOf("--range");
  let hits = [];

  if (rangeArgIndex !== -1) {
    const range = process.argv[rangeArgIndex + 1];
    hits.push(...scanFileNames(rangeFileNames(range)));
    hits.push(...scanDiffText(rangeDiffText(range)));
  } else if (isPrePush) {
    const stdin = readFileSync(0, "utf8");
    const updates = parsePrePushStdin(stdin);
    const ranges = collectRangesFromPrePush(updates);

    if (ranges.length === 0) {
      console.log("No probable secrets found. (nothing to push)");
      process.exit(0);
    }

    for (const range of ranges) {
      hits.push(...scanFileNames(rangeFileNames(range)));
      hits.push(...scanDiffText(rangeDiffText(range)));
    }
  } else {
    hits.push(...scanFileNames(stagedFileNames()));
    hits.push(...scanDiffText(stagedDiffText()));
  }

  process.exit(report(hits));
}

main();
