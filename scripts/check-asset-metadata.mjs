#!/usr/bin/env node
/**
 * Fails if any committed asset carries embedded metadata.
 *
 * Image metadata is a privacy leak, not a size problem: camera EXIF carries GPS
 * coordinates and serial numbers, Adobe/Canva XMP carries the author's real name
 * and account IDs, and Adobe's `xmp.did` GUIDs embed the creating machine's MAC
 * address. None of it renders, all of it ships to every visitor.
 *
 * Chunks/segments that affect rendering are allowed through — colour profiles
 * change how the image looks, so stripping them is not free.
 *
 * Usage: node scripts/check-asset-metadata.mjs [dir...]   (default: public)
 */

import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, extname } from "node:path";

const PNG_METADATA_CHUNKS = new Set(["tEXt", "zTXt", "iTXt", "eXIf", "tIME"]);

// JFIF is structural; ICC_PROFILE and the Adobe APP14 colour-transform marker
// affect decoding. Everything else (APP1 Exif/XMP, APP13 Photoshop IRB) is
// metadata we do not want public.
const JPEG_ALLOWED_APPN = new Map([
  [0xe0, ["JFIF", "JFXX"]],
  [0xe2, ["ICC_PROFILE"]],
  [0xee, ["Adobe"]],
]);

// Editor namespaces that routinely embed author names and local file paths.
const SVG_METADATA_PATTERNS = [
  [/<metadata[\s>]/i, "<metadata> element"],
  [/xmlns:(inkscape|sodipodi)=/i, "Inkscape/sodipodi namespace"],
  [/<!DOCTYPE svg[^>]*Adobe/i, "Adobe Illustrator doctype"],
  [/<x:xmpmeta|<rdf:RDF/i, "embedded XMP"],
];

const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

function checkPng(buf) {
  const found = [];
  let offset = 8;

  while (offset + 8 <= buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString("latin1", offset + 4, offset + 8);

    if (PNG_METADATA_CHUNKS.has(type)) {
      found.push(`${type} chunk (${length} bytes)`);
    }
    if (type === "IEND") break;
    offset += 12 + length;
  }

  return found;
}

function checkJpeg(buf) {
  const found = [];
  let offset = 2;

  while (offset + 4 <= buf.length && buf[offset] === 0xff) {
    const marker = buf[offset + 1];
    // Start of scan: everything after this is entropy-coded pixel data.
    if (marker === 0xda) break;

    const size = buf.readUInt16BE(offset + 2);
    const payload = buf.subarray(offset + 4, offset + 2 + size);

    if (marker === 0xfe) {
      found.push(`COM comment (${size} bytes)`);
    } else if (marker >= 0xe0 && marker <= 0xef) {
      const identifier = payload.toString("latin1", 0, 32).split("\0")[0];
      const allowed = JPEG_ALLOWED_APPN.get(marker) ?? [];
      if (!allowed.some((prefix) => identifier.startsWith(prefix))) {
        const label = identifier.trim() || "unknown";
        found.push(`APP${marker - 0xe0} segment "${label}" (${size} bytes)`);
      }
    }

    offset += 2 + size;
  }

  return found;
}

function checkSvg(buf) {
  const text = buf.toString("utf8");
  return SVG_METADATA_PATTERNS.filter(([pattern]) => pattern.test(text)).map(
    ([, label]) => label,
  );
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile()) yield full;
  }
}

const roots = process.argv.slice(2);
const targets = roots.length > 0 ? roots : ["public"];
const failures = [];
let scanned = 0;

for (const root of targets) {
  for await (const file of walk(root)) {
    const buf = readFileSync(file);
    let found = [];

    if (buf.subarray(0, 8).equals(PNG_SIGNATURE)) {
      found = checkPng(buf);
    } else if (buf[0] === 0xff && buf[1] === 0xd8) {
      found = checkJpeg(buf);
    } else if (extname(file).toLowerCase() === ".svg") {
      found = checkSvg(buf);
    } else {
      continue;
    }

    scanned += 1;
    if (found.length > 0) failures.push({ file, found });
  }
}

if (failures.length > 0) {
  console.error(`\nEmbedded metadata found in ${failures.length} asset(s):\n`);
  for (const { file, found } of failures) {
    console.error(`  ${file}`);
    for (const item of found) console.error(`    - ${item}`);
  }
  console.error(
    "\nThis metadata is published to every visitor and can contain names,\n" +
      "account IDs, GPS coordinates or machine identifiers. Strip it before\n" +
      "committing, then re-run this check.\n",
  );
  process.exit(1);
}

console.log(`No embedded metadata in ${scanned} asset(s).`);
