/**
 * The site-wide promo bar above the header, rendered by `src/overrides/PageFrame.astro`.
 *
 * Its text lives in the `zs.promo.*` strings in `src/content/i18n/en.json` and `fr.json`.
 * Set `active: true` to show it again. While it is off, the bar renders nothing and reserves no
 * space, as an inactive notice in `notices.ts` does.
 */
export const promoBar = {
  active: false,
};
