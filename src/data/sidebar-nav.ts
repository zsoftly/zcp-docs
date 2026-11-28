import type { NavIconName } from './nav-icons';
import { sidebarToTree, type SidebarEntry, type TreeItem } from '../lib/nav-tree';

/**
 * Console-style sidebar groups.
 *
 * The sidebar tree stays in astro.config.mjs. This file sorts its top-level entries into the
 * console's groups (small muted labels such as Learn or Public Cloud) and gives each section its
 * icon. The rows themselves are drawn by the shared NavTree (src/lib/nav-tree.ts).
 *
 * Entries are matched by the path of their first link, without the locale prefix, so the rules
 * hold for every locale even though Starlight translates the labels.
 */

export type NavGroupId = 'start' | 'learn' | 'developer' | 'zcp' | 'zpcp' | 'zcs' | 'help';

export const NAV_GROUP_ORDER: NavGroupId[] = [
  'start',
  'learn',
  'developer',
  'zcp',
  'zpcp',
  'zcs',
  'help',
];

/** Groups without a label read as the top of the list, like the console's home block. */
export const NAV_GROUP_LABEL_KEYS: Partial<Record<NavGroupId, string>> = {
  learn: 'zs.sidebar.group.learn',
  developer: 'zs.sidebar.group.developer',
  zcp: 'zs.sidebar.group.zcp',
  zpcp: 'zs.sidebar.group.zpcp',
  zcs: 'zs.sidebar.group.zcs',
  help: 'zs.sidebar.group.help',
};

interface TopLevelRule {
  prefix: string;
  group: NavGroupId;
  /** A product folder: its children become the group's sections and its own label is dropped. */
  expand?: boolean;
}

// First match wins, so specific paths come before the product folders that contain them.
const TOP_LEVEL_RULES: TopLevelRule[] = [
  { prefix: '/changelog', group: 'start' },
  { prefix: '/community', group: 'learn' },
  { prefix: '/tutorials', group: 'learn' },
  { prefix: '/public-cloud/cli', group: 'developer' },
  { prefix: '/public-cloud/api', group: 'developer' },
  { prefix: '/public-cloud/billing', group: 'help' },
  { prefix: '/troubleshooting', group: 'help' },
  { prefix: '/public-cloud/', group: 'zcp', expand: true },
  { prefix: '/private-cloud/', group: 'zpcp', expand: true },
  { prefix: '/cloud-storage/', group: 'zcs', expand: true },
];

// Section icons, longest prefix first. Same icons as the console where the area matches.
const ICON_RULES: [string, NavIconName][] = [
  ['/changelog', 'changelog'],
  ['/community', 'community'],
  ['/tutorials', 'tutorials'],
  ['/public-cloud/cli', 'cli'],
  ['/public-cloud/api', 'api'],
  ['/public-cloud/billing', 'billing'],
  ['/troubleshooting', 'troubleshooting'],
  ['/public-cloud/getting-started', 'start'],
  ['/public-cloud/projects', 'projects'],
  ['/public-cloud/iam', 'iam'],
  ['/public-cloud/compute', 'compute'],
  ['/public-cloud/operating-systems', 'images'],
  ['/public-cloud/networking', 'networking'],
  ['/public-cloud/storage', 'storage'],
  ['/public-cloud/object-storage', 'storage'],
  ['/public-cloud/kubernetes', 'kubernetes'],
  ['/public-cloud/dns', 'dns'],
  ['/public-cloud/marketplace', 'marketplace'],
  ['/public-cloud/store', 'marketplace'],
  ['/private-cloud/overview', 'overview'],
  ['/private-cloud/platform-components', 'components'],
  ['/private-cloud/getting-started', 'start'],
  ['/private-cloud/reference/support', 'support'],
  ['/private-cloud/reference', 'reference'],
  ['/cloud-storage/overview', 'overview'],
  ['/cloud-storage/getting-started', 'start'],
  ['/cloud-storage/reference', 'reference'],
];

export interface NavGroup {
  id: NavGroupId;
  items: TreeItem[];
}

/** The site path of a link, without the locale prefix, so `/fr/tutorials/` becomes `/tutorials/`. */
export function stripLocale(href: string, localePrefix: string): string {
  if (localePrefix && (href === localePrefix || href.startsWith(`${localePrefix}/`))) {
    return href.slice(localePrefix.length) || '/';
  }
  return href;
}

export function firstLinkHref(entry: SidebarEntry): string | undefined {
  if (entry.type === 'link') return entry.href;
  for (const child of entry.entries) {
    const href = firstLinkHref(child);
    if (href) return href;
  }
  return undefined;
}

function sectionPath(entry: SidebarEntry, localePrefix: string): string {
  const href = firstLinkHref(entry);
  return href ? stripLocale(href, localePrefix) : '';
}

function iconFor(entry: SidebarEntry, localePrefix: string): NavIconName {
  const path = sectionPath(entry, localePrefix);
  return ICON_RULES.find(([prefix]) => path.startsWith(prefix))?.[1] ?? 'reference';
}

/** A group holding one link is drawn as that link, so Billing reads as one row, not a folder. */
function flatten(entry: SidebarEntry): SidebarEntry {
  if (entry.type === 'group' && entry.entries.length === 1 && entry.entries[0]?.type === 'link') {
    return entry.entries[0];
  }
  return entry;
}

export function buildNavGroups(sidebar: SidebarEntry[], localePrefix: string): NavGroup[] {
  const groups = new Map<NavGroupId, TreeItem[]>();
  const add = (id: NavGroupId, entry: SidebarEntry) => {
    const items = groups.get(id) ?? [];
    const flat = flatten(entry);
    items.push(sidebarToTree(flat, iconFor(flat, localePrefix)));
    groups.set(id, items);
  };

  for (const entry of sidebar) {
    const path = sectionPath(entry, localePrefix);
    const rule = TOP_LEVEL_RULES.find((candidate) => path.startsWith(candidate.prefix));
    if (rule?.expand && entry.type === 'group') {
      for (const child of entry.entries) add(rule.group, child);
    } else {
      add(rule?.group ?? 'help', entry);
    }
  }

  return NAV_GROUP_ORDER.flatMap((id) => {
    const items = groups.get(id);
    return items?.length ? [{ id, items }] : [];
  });
}
