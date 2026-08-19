import { gzipSync } from 'node:zlib';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ASSETS_DIR = join(process.cwd(), 'dist', 'assets');
/** Fail if the SPA entry grows back toward the pre-split ~958 kB main chunk. */
const MAX_MAIN_RAW_BYTES = 850 * 1000;

const files = readdirSync(ASSETS_DIR).filter((name) => /^index-.*\.js$/.test(name));
if (files.length !== 1) {
  console.error(
    `Expected exactly one dist/assets/index-*.js, found: ${files.join(', ') || '(none)'}`,
  );
  process.exit(1);
}

const fileName = files[0];
if (!fileName) {
  console.error('Expected exactly one dist/assets/index-*.js, found none');
  process.exit(1);
}
const buf = readFileSync(join(ASSETS_DIR, fileName));
const rawKb = buf.length / 1000;
const gzipKb = gzipSync(buf).length / 1000;

console.log(
  `Main chunk ${fileName}: ${rawKb.toFixed(2)} kB raw, ${gzipKb.toFixed(2)} kB gzip (limit ${(MAX_MAIN_RAW_BYTES / 1000).toFixed(0)} kB raw)`,
);

if (buf.length > MAX_MAIN_RAW_BYTES) {
  console.error('Main JS chunk exceeds the bundle budget. See docs/audits/bundle-optimization-v1.md');
  process.exit(1);
}
