/**
 * Site-wide notices.
 *
 * A notice renders as a bar under the promo bar on every page, so customers see
 * service-affecting information without having to find the page it applies to.
 *
 * To publish one, add an entry below and the matching `zs.notice.*` strings to
 * `src/content/i18n/en.json` and `src/content/i18n/fr.json`. To retire one, set
 * `active: false` or let `endsAt` pass. Only the first notice that is currently
 * showing is rendered, so keep the list short and ordered by importance.
 */

export type NoticeSeverity = 'info' | 'caution' | 'danger';

export interface SiteNotice {
  /** Stable id. Also the per-session dismiss key, so change it to re-show a revised notice. */
  id: string;
  severity: NoticeSeverity;
  /** i18n key for the short prefix, for example "Service notice". */
  labelKey: string;
  /** i18n key for the message body. */
  textKey: string;
  /** i18n key for the link text. Requires `path`. */
  linkKey?: string;
  /** Site-relative path, without a locale prefix and without a leading slash. */
  path?: string;
  /** Set false to retire the notice while keeping it here for reference. */
  active: boolean;
  /** ISO timestamps. Omit either side to leave that end open. */
  startsAt?: string;
  endsAt?: string;
}

export const siteNotices: SiteNotice[] = [
  {
    id: 'ca-delegation-2026-09',
    severity: 'caution',
    labelKey: 'zs.notice.caDelegation.label',
    textKey: 'zs.notice.caDelegation.text',
    linkKey: 'zs.notice.caDelegation.link',
    path: 'public-cloud/dns/troubleshooting/',
    active: true,
    startsAt: '2026-09-15T00:00:00Z',
  },
];

export function getActiveNotice(now: Date = new Date()): SiteNotice | undefined {
  return siteNotices.find((notice) => {
    if (!notice.active) return false;
    if (notice.startsAt && now < new Date(notice.startsAt)) return false;
    if (notice.endsAt && now > new Date(notice.endsAt)) return false;
    return true;
  });
}
