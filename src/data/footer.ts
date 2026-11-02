import { CLOUD_LOGIN_URL, CLOUD_REGISTER_URL, cloudUrl, websiteUrl } from './site';

export const DOCS_REPO_URL = 'https://github.com/zsoftly/zcp-docs';
export const DOCS_FEEDBACK_URL = `${DOCS_REPO_URL}/issues/new?labels=feedback&title=Feedback+on+docs`;
export const STATUS_PAGE_URL = 'https://status.zsoftly.ca/';

/**
 * How the footer renders a link.
 *
 * - `docs`: a docs page. `href` is unprefixed and gets `/fr` on the French site.
 * - `site`: a page on this site in one locale only, used as is.
 * - `external`: another site. Opens in a new tab.
 */
export type FooterLinkKind = 'docs' | 'site' | 'external';

export interface FooterLink {
  /** Must exist in both `src/content/i18n/en.json` and `fr.json`. */
  labelKey: string;
  href: string;
  kind: FooterLinkKind;
}

export interface FooterColumn {
  /** Must exist in both `src/content/i18n/en.json` and `fr.json`. */
  headingKey: string;
  links: FooterLink[];
}

/**
 * The four footer columns. Add, remove or reorder links here rather than in
 * `src/overrides/Footer.astro`.
 */
export const footerColumns: FooterColumn[] = [
  {
    headingKey: 'zs.footer.platforms',
    links: [
      {
        labelKey: 'zs.footer.publicCloudDocs',
        href: '/public-cloud/getting-started/introduction/',
        kind: 'docs',
      },
      { labelKey: 'zs.footer.privateCloudDocs', href: '/private-cloud/overview/', kind: 'docs' },
      { labelKey: 'zs.footer.cloudStorageDocs', href: '/cloud-storage/overview/', kind: 'docs' },
      { labelKey: 'zs.footer.pricing', href: `${websiteUrl}/pricing`, kind: 'external' },
      {
        labelKey: 'zs.footer.pricingCalculator',
        href: `${websiteUrl}/pricing#calculator`,
        kind: 'external',
      },
      { labelKey: 'zs.footer.createAccount', href: CLOUD_REGISTER_URL, kind: 'external' },
      { labelKey: 'zs.footer.logIn', href: CLOUD_LOGIN_URL, kind: 'external' },
    ],
  },
  {
    headingKey: 'zs.footer.support',
    links: [
      { labelKey: 'zs.footer.community', href: '/community/', kind: 'docs' },
      { labelKey: 'zs.footer.status', href: STATUS_PAGE_URL, kind: 'external' },
      { labelKey: 'zs.footer.contact', href: `${websiteUrl}/contact`, kind: 'external' },
      { labelKey: 'zs.toc.feedback', href: DOCS_FEEDBACK_URL, kind: 'external' },
    ],
  },
  {
    headingKey: 'zs.footer.resources',
    links: [
      { labelKey: 'zs.header.tutorials', href: '/tutorials/', kind: 'docs' },
      { labelKey: 'zs.footer.changelog', href: '/changelog/', kind: 'docs' },
      { labelKey: 'zs.footer.cli', href: '/public-cloud/cli/installation/', kind: 'docs' },
      { labelKey: 'zs.footer.api', href: '/public-cloud/api/authentication/', kind: 'docs' },
      { labelKey: 'zs.footer.sitemap', href: '/sitemap/', kind: 'site' },
      { labelKey: 'zs.footer.github', href: DOCS_REPO_URL, kind: 'external' },
    ],
  },
  {
    headingKey: 'zs.footer.company',
    links: [
      { labelKey: 'zs.footer.website', href: websiteUrl, kind: 'external' },
      { labelKey: 'zs.footer.services', href: `${websiteUrl}/services`, kind: 'external' },
      {
        labelKey: 'zs.footer.privateCloud',
        href: `${websiteUrl}/services/private-cloud`,
        kind: 'external',
      },
      { labelKey: 'zs.footer.compare', href: `${websiteUrl}/compare`, kind: 'external' },
      { labelKey: 'zs.footer.console', href: cloudUrl, kind: 'external' },
    ],
  },
];
