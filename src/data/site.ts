export const websiteUrl = (import.meta.env.PUBLIC_WEBSITE_URL ?? 'https://zcp.zsoftly.ca').replace(
  /\/+$/,
  ''
);

export const COMMUNITY_PAGE_URL = `${websiteUrl}/community`;

/** The website page for the Forward Deployed Engineering service. */
export const FDE_PAGE_URL = `${websiteUrl}/professional-services/forward-deployed-engineering/`;

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
 * Add, remove or reorder entries here rather than in the components. A docs
 * link has a `path` that is site-relative without a locale prefix, so each
 * caller adds `/fr` when rendering the French site. An external link has an
 * absolute `href`, is never marked current and opens in a new tab, like the
 * footer's external links. Every label key must exist in both
 * `src/content/i18n/en.json` and `src/content/i18n/fr.json`.
 */
interface DocsNavLinkBase {
  /** Label in the header bar, where the nav shares one row with the controls. */
  labelKey: string;
  /** Longer label for the mobile menu, which has room for it. Defaults to `labelKey`. */
  menuLabelKey?: string;
}

export interface DocsNavPathLink extends DocsNavLinkBase {
  path: string;
  /**
   * Extra unprefixed paths whose pages count as part of this link's section,
   * so the link stays marked while a reader is anywhere inside it.
   */
  sections?: string[];
}

export interface DocsNavExternalLink extends DocsNavLinkBase {
  href: string;
}

export type DocsNavLink = DocsNavPathLink | DocsNavExternalLink;

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
  { labelKey: 'zs.header.fde', menuLabelKey: 'zs.nav.fde', href: FDE_PAGE_URL },
];

export function isExternalNavLink(link: DocsNavLink): link is DocsNavExternalLink {
  return 'href' in link;
}

/** The href for a header link, with the locale prefix on docs links only. */
export function docsNavHref(link: DocsNavLink, localePrefix: string): string {
  return isExternalNavLink(link) ? link.href : `${localePrefix}${link.path}`;
}

/**
 * The `aria-current` value for a header link on the page at `pathname`:
 * `page` on the link's own page, `true` anywhere else in its section.
 * External links are never current.
 */
export function docsNavCurrent(
  link: DocsNavLink,
  pathname: string,
  localePrefix: string
): 'page' | 'true' | undefined {
  if (isExternalNavLink(link)) return undefined;
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
