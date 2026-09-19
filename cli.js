#!/usr/bin/env node

import po2json from './index.js';
import fs from 'node:fs';
import { version } from './package.json' with { type: 'json' };
import { program } from 'commander';

program
  .version(version)
  .arguments('<input> <output>')
  .option('-p --pretty', 'pretty-print JSON')
  .option('-F --fuzzy', 'include fuzzy messages')
  .option('-f --format [format]', 'output format [raw, jed, jedold, mf, jed1.x]', 'raw')
  .option('-M --full-mf', 'return full messageformat output (instead of only translations)')
  .option('-d --domain [domain]', 'domain')
  .option('--fallback-to-msgid', 'use msgid if translation is missing (nplurals must match)')
  .action(function (input, output) {
    const opts = program.opts();
    opts.stringify = true;
    const result = po2json.parseFileSync(input, opts);
    fs.createWriteStream(output, {}).write(result);
  })

program.parse();
