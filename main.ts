// StatAtlas hand-in (Node 22, standard library only): the site is this directory's
// app/ folder, plain static files a browser opens at app/index.html (ES modules,
// CSS, charts drawn as SVG, no build step and no network request). This program
// hands it in: it copies app/ and screenshots/ from beside this file to /output
// and writes /output/dossier.json, the summary the judge reads (the screenshots,
// the first load's files and bytes, and the source), with the vendored make.fun
// library. Leave vendor/makefun-frontend.ts as it is: the scorer requires
// dossier.json to be byte for byte what its own copy writes.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Fail loudly instead of handing in an empty or broken entry: the site must
// have its index, and the screenshots folder must hold 3 or 4 images.
if (!existsSync(join(out, 'app', 'index.html'))) throw new Error('app/index.html is missing from the output');
const shots = readdirSync(join(out, 'screenshots')).filter((name) => !name.startsWith('.'));
if (shots.length < 3 || shots.length > 4) throw new Error('screenshots/ must hold 3 or 4 images, found ' + shots.length);

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);

// Read the dossier back and make sure it is real JSON, so a broken hand-in
// fails here instead of at the scorer.
const dossier = JSON.parse(readFileSync(join(out, 'dossier.json'), 'utf8'));
if (!dossier || typeof dossier !== 'object') throw new Error('dossier.json did not parse');
