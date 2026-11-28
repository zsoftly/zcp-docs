import type { StarlightRouteData } from '@astrojs/starlight/route-data';
import type { NavIconName } from '../data/nav-icons';

/**
 * The one navigation tree behind the left sidebar and the right "On this page" panel. Both are
 * drawn by src/components/NavTree.astro, in the console's sidebar style: rows with an optional
 * icon, branches that fold behind a chevron, children beside a thin guide, and one highlighted
 * current row. Each source only needs an adapter into `TreeItem`.
 */
export interface TreeItem {
  label: string;
  /** A branch with an href is a link that also folds, as each heading in "On this page" is. */
  href?: string;
  /** `page` for the page you are on (sidebar); `true` for the heading you are reading (TOC). */
  current?: 'page' | 'true';
  icon?: NavIconName;
  external?: boolean;
  badge?: { text: string; variant: string; class?: string };
  /** Extra link attributes from the sidebar config (Starlight's `attrs`). */
  attrs?: Extract<SidebarEntry, { type: 'link' }>['attrs'];
  children?: TreeItem[];
  /** Starts open. Defaults to "holds the current page". */
  open?: boolean;
}

export type SidebarEntry = StarlightRouteData['sidebar'][number];
type TocItem = NonNullable<StarlightRouteData['toc']>['items'][number];

export function holdsCurrent(item: TreeItem): boolean {
  return Boolean(item.current) || (item.children ?? []).some(holdsCurrent);
}

/** Starlight's sidebar entries, with an optional icon per top-level row. */
export function sidebarToTree(entry: SidebarEntry, icon?: NavIconName): TreeItem {
  if (entry.type === 'link') {
    return {
      label: entry.label,
      href: entry.href,
      current: entry.isCurrent ? 'page' : undefined,
      icon,
      badge: entry.badge,
      attrs: entry.attrs,
    };
  }
  return {
    label: entry.label,
    icon,
    badge: entry.badge,
    children: entry.entries.map((child) => sidebarToTree(child)),
  };
}

/** Starlight's table of contents headings. The current one is set while the page scrolls. */
export function tocToTree(items: TocItem[]): TreeItem[] {
  return items.map((item) => ({
    label: item.text,
    href: `#${item.slug}`,
    children: item.children.length ? tocToTree(item.children) : undefined,
    open: false,
  }));
}
