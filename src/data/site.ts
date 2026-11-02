export const websiteUrl = (import.meta.env.PUBLIC_WEBSITE_URL ?? 'https://zcp.zsoftly.ca').replace(
  /\/+$/,
  ''
);

export const COMMUNITY_PAGE_URL = `${websiteUrl}/community`;

export const cloudUrl = (
  import.meta.env.PUBLIC_CLOUD_URL ?? 'https://cloud.zcp.zsoftly.ca'
).replace(/\/+$/, '');

export const CLOUD_LOGIN_URL = `${cloudUrl}/login`;
export const CLOUD_REGISTER_URL = `${cloudUrl}/register`;

export const COMMUNITY_SLACK_URL =
  'https://join.slack.com/t/zsoftlycloudp-exg5502/shared_invite/zt-469b56b2b-lG5HB2WnuntgwFG4UwfMew';

/**
 * Primary documentation links in the site header and the mobile menu.
 *
 * Add, remove or reorder entries here rather than in the components. `path` is
 * site-relative without a locale prefix, so each caller adds `/fr` when
 * rendering the French site. `labelKey` must exist in both
 * `src/content/i18n/en.json` and `src/content/i18n/fr.json`.
 */
export interface DocsNavLink {
  labelKey: string;
  path: string;
  /**
   * Extra unprefixed paths whose pages count as part of this link's section,
   * so the link stays marked while a reader is anywhere inside it.
   */
  sections?: string[];
}

export const docsNavLinks: DocsNavLink[] = [
  { labelKey: 'zs.header.getStarted', path: '/public-cloud/getting-started/quickstart/' },
  { labelKey: 'zs.header.products', path: '/public-cloud/getting-started/introduction/' },
  { labelKey: 'zs.header.tutorials', path: '/tutorials/', sections: ['/tutorials/'] },
  {
    labelKey: 'zs.header.cliApi',
    path: '/public-cloud/cli/quickstart/',
    sections: ['/public-cloud/cli/', '/public-cloud/api/'],
  },
  { labelKey: 'zs.header.releaseNotes', path: '/changelog/', sections: ['/changelog/'] },
];

/**
 * The `aria-current` value for a header link on the page at `pathname`:
 * `page` on the link's own page, `true` anywhere else in its section.
 */
export function docsNavCurrent(
  link: DocsNavLink,
  pathname: string,
  localePrefix: string
): 'page' | 'true' | undefined {
  const withSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`);
  const current = withSlash(pathname);
  if (current === withSlash(`${localePrefix}${link.path}`)) return 'page';
  const inSection = (link.sections ?? []).some((section) =>
    current.startsWith(`${localePrefix}${section}`)
  );
  return inSection ? 'true' : undefined;
}

/**
 * Path prefix for the active locale, for building site-relative links.
 *
 * Every component that builds a localised href reads this, so adding a locale
 * is one change here rather than one per component.
 */
export function localePathPrefix(locale: string | undefined): string {
  return locale === 'fr' ? '/fr' : '';
}
