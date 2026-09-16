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
 * Links in the "Explore ZCP" header menu and the mobile menu.
 *
 * Add, remove or reorder entries here rather than in the components. `labelKey`
 * must exist in both `src/content/i18n/en.json` and `src/content/i18n/fr.json`.
 */
export interface ExploreLink {
  labelKey: string;
  /** One short line under the label, as the marketing site header does. */
  noteKey: string;
  href: string;
}

export const exploreLinks: ExploreLink[] = [
  {
    labelKey: 'zs.header.services',
    noteKey: 'zs.header.servicesNote',
    href: `${websiteUrl}/services`,
  },
  {
    labelKey: 'zs.header.compare',
    noteKey: 'zs.header.compareNote',
    href: `${websiteUrl}/compare`,
  },
  {
    labelKey: 'zs.header.pricing',
    noteKey: 'zs.header.pricingNote',
    href: `${websiteUrl}/pricing`,
  },
  {
    labelKey: 'zs.header.pricingCalculator',
    noteKey: 'zs.header.pricingCalculatorNote',
    href: `${websiteUrl}/pricing#calculator`,
  },
  {
    labelKey: 'zs.header.privateCloud',
    noteKey: 'zs.header.privateCloudNote',
    href: `${websiteUrl}/services/private-cloud`,
  },
];

/**
 * Primary documentation links in the site header and the mobile menu.
 *
 * `path` is site-relative without a locale prefix, so each caller adds `/fr`
 * when rendering the French site.
 */
export interface DocsNavLink {
  labelKey: string;
  path: string;
}

export const docsNavLinks: DocsNavLink[] = [
  { labelKey: 'zs.header.quickstart', path: '/public-cloud/getting-started/quickstart' },
  { labelKey: 'zs.header.browseDocs', path: '/public-cloud/getting-started/introduction' },
  { labelKey: 'zs.header.tutorials', path: '/tutorials' },
];

/**
 * Path prefix for the active locale, for building site-relative links.
 *
 * Every component that builds a localised href reads this, so adding a locale
 * is one change here rather than one per component.
 */
export function localePathPrefix(locale: string | undefined): string {
  return locale === 'fr' ? '/fr' : '';
}
