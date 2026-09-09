// Single source of truth for the Kubernetes versions ZCP managed clusters support.
// Update this file when a version is added, patched, or retired, then the Supported
// versions section on public-cloud/kubernetes/create-cluster.mdx picks up the change automatically.

export type KubernetesVersion = {
  // Full semver, e.g. '1.37.0'.
  version: string;
  // Minor line, e.g. '1.37'.
  minor: string;
  // The version new clusters get unless the customer picks another one.
  isDefault: boolean;
  // Whether a new cluster can still choose this exact version.
  offeredForNewClusters: boolean;
};

// Newest version first within each status group.
export const kubernetesVersions: KubernetesVersion[] = [
  { version: '1.37.0', minor: '1.37', isDefault: false, offeredForNewClusters: true },
  { version: '1.36.4', minor: '1.36', isDefault: true, offeredForNewClusters: true },
  { version: '1.35.8', minor: '1.35', isDefault: false, offeredForNewClusters: true },
  { version: '1.34.11', minor: '1.34', isDefault: false, offeredForNewClusters: true },
  { version: '1.36.1', minor: '1.36', isDefault: false, offeredForNewClusters: false },
  { version: '1.35.1', minor: '1.35', isDefault: false, offeredForNewClusters: false },
  { version: '1.34.3', minor: '1.34', isDefault: false, offeredForNewClusters: false },
];

export const newClusterVersions = kubernetesVersions.filter((v) => v.offeredForNewClusters);

// Older patch releases still running on existing clusters, no longer offered for new ones.
export const legacyVersions = kubernetesVersions.filter((v) => !v.offeredForNewClusters);

export const defaultVersion = newClusterVersions.find((v) => v.isDefault)!;

// The newest minor line ZCP offers, used for upgrade examples.
export const newestVersion = newClusterVersions[0];

export type KubernetesLifecycle = {
  minor: string;
  maintenanceDate: string;
  eolDate: string;
};

// Source: https://kubernetes.io/releases/patch-releases/
export const kubernetesLifecycles: KubernetesLifecycle[] = [
  { minor: '1.37', maintenanceDate: 'August 28, 2027', eolDate: 'October 28, 2027' },
  { minor: '1.36', maintenanceDate: 'April 28, 2027', eolDate: 'June 28, 2027' },
  { minor: '1.35', maintenanceDate: 'December 28, 2026', eolDate: 'February 28, 2027' },
  { minor: '1.34', maintenanceDate: 'August 27, 2026', eolDate: 'October 27, 2026' },
];

const joinList = (items: string[], conjunction: 'and' | 'or'): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')}, ${conjunction} ${items[items.length - 1]}`;
};

const supportedMinors = (): string[] => [...new Set(newClusterVersions.map((v) => v.minor))].sort();

// e.g. "1.34, 1.35, 1.36, and 1.37"
export const supportedMinorsList = (conjunction: 'and' | 'or' = 'and'): string =>
  joinList(supportedMinors(), conjunction);

// e.g. "1.34, 1.35, 1.36, 1.37" (plain comma list, no conjunction, for table cells)
export const supportedMinorsPlain = (): string => supportedMinors().join(', ');

// e.g. "1.37.0, 1.36.4 (the default), 1.35.8, or 1.34.11"
export const newClusterVersionsList = (conjunction: 'and' | 'or' = 'or'): string => {
  const items = newClusterVersions.map((v) =>
    v.isDefault ? `${v.version} (the default)` : v.version
  );
  return joinList(items, conjunction);
};

// e.g. "1.36.1, 1.35.1, or 1.34.3"
export const legacyVersionsList = (conjunction: 'and' | 'or' = 'or'): string =>
  joinList(
    legacyVersions.map((v) => v.version),
    conjunction
  );
