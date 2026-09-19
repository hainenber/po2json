import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'index.js',
    cli: 'cli.js',
  },
  format: ['esm', 'cjs'],
  clean: true,
  shims: true,
})