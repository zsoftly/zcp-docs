import { defineEcConfig } from '@astrojs/starlight/expressive-code';

// Starlight's Expressive Code integration discovers this project-root config.
// No explicit Expressive Code key is needed in astro.config.mjs.
//
// emitExternalStylesheet: false — inlines EC styles as a <style> tag per page
// instead of emitting a shared /_astro/ec.*.css asset.
//
// codeLineHeight is intentionally omitted. Starlight's preprocessor already
// defaults it to 'var(--sl-line-height)'. EC passes styleOverrides values
// directly as CSS property values, so both unitless numbers and CSS variable
// references (e.g. var(--sl-line-height, 1.65)) are valid — but overriding
// the variable here would break Starlight's own line-height token.
// defaultProps.frame: 'none' — render every code block as a flat box with no
// frame chrome (no terminal dots / titlebar, no editor tab). This gives a
// consistent look across all languages (shell, yaml, json, …). Frames remain
// disabled as a site design choice.
export default defineEcConfig({
  emitExternalStylesheet: false,
  defaultProps: {
    frame: 'none',
  },
  styleOverrides: {
    codePaddingBlock: '1.125rem',
  },
});
