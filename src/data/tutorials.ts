import type { IconShape } from './marketplace-highlights';

/**
 * Publication dates for tutorials, used to pick the newest few for the home
 * page.
 *
 * Git commit dates would be the obvious source, but CI checks out at depth 1,
 * so every file looks like it changed at the same moment there. Dates are
 * declared here instead, the same way `changelog-feed.ts` handles them.
 *
 * The home page enumerates the tutorials collection rather than this map, so a
 * tutorial missing an entry still renders. It just sorts last, behind anything
 * dated, which keeps an undated newcomer out of the "latest" slots until
 * someone gives it a date.
 */
export const tutorialPublishedOn: Record<string, string> = {
  'build-private-network-headscale': '2026-09-14',
  'backup-vaultwarden-restic-object-storage': '2026-09-13',
  'manage-infrastructure-terraform': '2026-09-13',
  'configure-email-authentication-dns': '2026-09-11',
  'deploy-vps-dokploy-cli': '2026-08-16',
  'ollama-chat-and-inference': '2026-08-16',
  'open-webui-with-ollama': '2026-08-16',
  'host-dns-on-zcp-cli': '2026-08-08',
  'deploy-openclaw-marketplace-cli': '2026-06-19',
};

/** Four fills the two-column card grid exactly, with no odd card left over. */
export const HOME_TUTORIAL_COUNT = 4;

/** Icon badge per tutorial. Anything unlisted falls back to the book below. */
export const tutorialIcons: Record<string, { color: string; icon: IconShape[] }> = {
  'build-private-network-headscale': {
    color: '#64748b',
    icon: [
      { tag: 'circle', cx: '12', cy: '5', r: '2.5' },
      { tag: 'circle', cx: '5', cy: '19', r: '2.5' },
      { tag: 'circle', cx: '19', cy: '19', r: '2.5' },
      { tag: 'path', d: 'M12 7.5v4m0 0-5.5 5m5.5-5 5.5 5' },
    ],
  },
  'backup-vaultwarden-restic-object-storage': {
    color: '#14b8a6',
    icon: [
      { tag: 'rect', width: '18', height: '11', x: '3', y: '11', rx: '2' },
      { tag: 'path', d: 'M7 11V7a5 5 0 0 1 10 0v4' },
    ],
  },
  'manage-infrastructure-terraform': {
    color: '#8b5cf6',
    icon: [
      {
        tag: 'path',
        d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
      },
      { tag: 'polyline', points: '3.29 7 12 12 20.71 7' },
    ],
  },
  'configure-email-authentication-dns': {
    color: '#0ea5e9',
    icon: [
      { tag: 'rect', width: '20', height: '16', x: '2', y: '4', rx: '2' },
      { tag: 'path', d: 'm22 7-10 6L2 7' },
    ],
  },
  'deploy-vps-dokploy-cli': {
    color: '#f97316',
    icon: [
      { tag: 'path', d: 'M22 10v6M2 10l10-5 10 5-10 5z' },
      { tag: 'path', d: 'M6 12v5c3 3 9 3 12 0v-5' },
    ],
  },
  'deploy-openclaw-marketplace-cli': {
    color: '#10b981',
    icon: [
      { tag: 'path', d: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' },
      { tag: 'line', x1: '3', y1: '6', x2: '21', y2: '6' },
      { tag: 'path', d: 'M16 10a4 4 0 0 1-8 0' },
    ],
  },
  'ollama-chat-and-inference': {
    color: '#ec4899',
    icon: [
      { tag: 'rect', width: '16', height: '12', x: '4', y: '8', rx: '2' },
      { tag: 'path', d: 'M12 8V4M8 2h8' },
      { tag: 'circle', cx: '9', cy: '14', r: '1' },
      { tag: 'circle', cx: '15', cy: '14', r: '1' },
    ],
  },
  'open-webui-with-ollama': {
    color: '#a855f7',
    icon: [
      { tag: 'rect', width: '18', height: '14', x: '3', y: '4', rx: '2' },
      { tag: 'path', d: 'M3 9h18M8 20h8' },
    ],
  },
  'host-dns-on-zcp-cli': {
    color: '#eab308',
    icon: [
      { tag: 'circle', cx: '12', cy: '12', r: '10' },
      { tag: 'path', d: 'M2 12h20' },
      { tag: 'path', d: 'M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20' },
    ],
  },
};

export const defaultTutorialIcon: { color: string; icon: IconShape[] } = {
  color: '#3b82f6',
  icon: [
    { tag: 'path', d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z' },
    { tag: 'path', d: 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' },
  ],
};
