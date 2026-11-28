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

/**
 * Outline icon per tutorial. Anything unlisted falls back to the book below.
 * Icons take the accent colour from the page, so tutorials differ by icon and
 * title, never by colour.
 */
export const tutorialIcons: Record<string, IconShape[]> = {
  'build-private-network-headscale': [
    { tag: 'circle', cx: '12', cy: '5', r: '2.5' },
    { tag: 'circle', cx: '5', cy: '19', r: '2.5' },
    { tag: 'circle', cx: '19', cy: '19', r: '2.5' },
    { tag: 'path', d: 'M12 7.5v4m0 0-5.5 5m5.5-5 5.5 5' },
  ],
  'backup-vaultwarden-restic-object-storage': [
    { tag: 'rect', width: '18', height: '11', x: '3', y: '11', rx: '2' },
    { tag: 'path', d: 'M7 11V7a5 5 0 0 1 10 0v4' },
  ],
  'manage-infrastructure-terraform': [
    {
      tag: 'path',
      d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
    },
    { tag: 'polyline', points: '3.29 7 12 12 20.71 7' },
  ],
  'configure-email-authentication-dns': [
    { tag: 'rect', width: '20', height: '16', x: '2', y: '4', rx: '2' },
    { tag: 'path', d: 'm22 7-10 6L2 7' },
  ],
  'deploy-vps-dokploy-cli': [
    { tag: 'path', d: 'M22 10v6M2 10l10-5 10 5-10 5z' },
    { tag: 'path', d: 'M6 12v5c3 3 9 3 12 0v-5' },
  ],
  'deploy-openclaw-marketplace-cli': [
    { tag: 'path', d: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' },
    { tag: 'line', x1: '3', y1: '6', x2: '21', y2: '6' },
    { tag: 'path', d: 'M16 10a4 4 0 0 1-8 0' },
  ],
  'ollama-chat-and-inference': [
    { tag: 'rect', width: '16', height: '12', x: '4', y: '8', rx: '2' },
    { tag: 'path', d: 'M12 8V4M8 2h8' },
    { tag: 'circle', cx: '9', cy: '14', r: '1' },
    { tag: 'circle', cx: '15', cy: '14', r: '1' },
  ],
  'open-webui-with-ollama': [
    { tag: 'rect', width: '18', height: '14', x: '3', y: '4', rx: '2' },
    { tag: 'path', d: 'M3 9h18M8 20h8' },
  ],
  'host-dns-on-zcp-cli': [
    { tag: 'circle', cx: '12', cy: '12', r: '10' },
    { tag: 'path', d: 'M2 12h20' },
    { tag: 'path', d: 'M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20' },
  ],
  'encrypt-object-storage': [
    { tag: 'circle', cx: '7.5', cy: '15.5', r: '4.5' },
    { tag: 'path', d: 'm10.7 12.3 9.8-9.8M17 6l2.5 2.5M14.5 8.5 17 11' },
  ],
  'paperclip-on-zcp': [
    {
      tag: 'path',
      d: 'm21.4 11.1-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5',
    },
  ],
  'deploy-private-shared-storage': [
    { tag: 'rect', width: '20', height: '8', x: '2', y: '3', rx: '2' },
    { tag: 'rect', width: '20', height: '8', x: '2', y: '13', rx: '2' },
    { tag: 'line', x1: '6', y1: '7', x2: '6.01', y2: '7' },
    { tag: 'line', x1: '6', y1: '17', x2: '6.01', y2: '17' },
  ],
  'deploy-ubuntu-employee-desktops': [
    { tag: 'rect', width: '20', height: '14', x: '2', y: '3', rx: '2' },
    { tag: 'path', d: 'M8 21h8M12 17v4' },
  ],
  'connect-desktops-to-storage': [
    { tag: 'path', d: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7' },
    { tag: 'path', d: 'M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7' },
  ],
  'manage-dns-zone-as-a-file': [
    { tag: 'path', d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
    { tag: 'polyline', points: '14 2 14 8 20 8' },
    { tag: 'path', d: 'M8 13h8M8 17h5' },
  ],
};

export const defaultTutorialIcon: IconShape[] = [
  { tag: 'path', d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z' },
  { tag: 'path', d: 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' },
];

/**
 * The tutorial catalog: one entry per tutorial, grouped by category. The Tutorials overview page
 * (src/components/TutorialCatalog.astro) and the Tutorials section of the sidebar
 * (astro.config.mjs) are both built from this list, so you add a new tutorial here once.
 * Titles and descriptions come from each page's frontmatter. `minutes` is set only where the page
 * itself states a time. Multi-part tutorials list their first page only.
 */
export type TutorialCategoryId = 'servers' | 'ai' | 'network' | 'storage' | 'workplace';
export type TutorialTool = 'cli' | 'terraform' | 'marketplace';

export interface TutorialCategory {
  id: TutorialCategoryId;
  label: { en: string; fr: string };
  desc: { en: string; fr: string };
}

export interface TutorialEntry {
  slug: string;
  category: TutorialCategoryId;
  /** Short label for the sidebar, in both languages. */
  sidebarLabel: { en: string; fr: string };
  tools: TutorialTool[];
  minutes?: number;
}

export const tutorialCategories: TutorialCategory[] = [
  {
    id: 'servers',
    label: { en: 'Servers and automation', fr: 'Serveurs et automatisation' },
    desc: {
      en: 'Launch virtual machines and manage them as code.',
      fr: 'Lancez des machines virtuelles et gérez-les sous forme de code.',
    },
  },
  {
    id: 'ai',
    label: { en: 'AI and agents', fr: 'IA et agents' },
    desc: {
      en: 'Run models and AI assistants on your own virtual machines.',
      fr: 'Exécutez des modèles et des assistants IA sur vos propres machines virtuelles.',
    },
  },
  {
    id: 'network',
    label: { en: 'Networking and DNS', fr: 'Réseautage et DNS' },
    desc: {
      en: 'Build private networks and manage DNS zones and email records.',
      fr: 'Créez des réseaux privés et gérez les zones DNS et les enregistrements de courriel.',
    },
  },
  {
    id: 'storage',
    label: { en: 'Storage and backup', fr: 'Stockage et sauvegarde' },
    desc: {
      en: 'Encrypt, share and back up your data.',
      fr: 'Chiffrez, partagez et sauvegardez vos données.',
    },
  },
  {
    id: 'workplace',
    label: { en: 'Private workplace', fr: 'Espace de travail privé' },
    desc: {
      en: 'Give your team remote desktops on a private network.',
      fr: 'Offrez à votre équipe des postes de travail à distance sur un réseau privé.',
    },
  },
];

export const tutorialCatalog: TutorialEntry[] = [
  {
    slug: 'deploy-vps-dokploy-cli',
    category: 'servers',
    sidebarLabel: {
      en: 'Deploy a VPS with Dokploy (CLI)',
      fr: 'Déployer un VPS avec Dokploy (CLI)',
    },
    tools: ['cli'],
    minutes: 15,
  },
  {
    slug: 'manage-infrastructure-terraform',
    category: 'servers',
    sidebarLabel: {
      en: 'Manage ZCP with Terraform / OpenTofu',
      fr: 'Gérer ZCP avec Terraform / OpenTofu',
    },
    tools: ['terraform'],
    minutes: 15,
  },
  {
    slug: 'ollama-chat-and-inference',
    category: 'ai',
    sidebarLabel: { en: 'Ollama Chat and Inference', fr: 'Ollama : chat et inférence' },
    tools: ['cli', 'marketplace'],
  },
  {
    slug: 'open-webui-with-ollama',
    category: 'ai',
    sidebarLabel: { en: 'Open WebUI With Ollama', fr: 'Open WebUI avec Ollama' },
    tools: ['cli'],
  },
  {
    slug: 'deploy-openclaw-marketplace-cli',
    category: 'ai',
    sidebarLabel: {
      en: 'Deploy OpenClaw (Marketplace, CLI)',
      fr: 'Déployer OpenClaw (Marketplace, CLI)',
    },
    tools: ['cli', 'marketplace'],
    minutes: 10,
  },
  {
    slug: 'paperclip-on-zcp',
    category: 'ai',
    sidebarLabel: { en: 'Deploy Paperclip', fr: 'Déployer Paperclip' },
    tools: ['cli'],
  },
  {
    slug: 'build-private-network-headscale',
    category: 'network',
    sidebarLabel: { en: 'Build a Private Network (CLI)', fr: 'Créer un réseau privé (CLI)' },
    tools: ['cli', 'marketplace'],
    minutes: 30,
  },
  {
    slug: 'host-dns-on-zcp-cli',
    category: 'network',
    sidebarLabel: { en: 'Host DNS on ZCP (CLI)', fr: 'Héberger le DNS sur ZCP (CLI)' },
    tools: ['cli'],
    minutes: 20,
  },
  {
    slug: 'manage-dns-zone-as-a-file',
    category: 'network',
    sidebarLabel: { en: 'Manage a Zone as a File', fr: 'Gérer une zone sous forme de fichier' },
    tools: ['cli'],
    minutes: 20,
  },
  {
    slug: 'configure-email-authentication-dns',
    category: 'network',
    sidebarLabel: {
      en: 'Configure Email Authentication DNS',
      fr: 'Configurer le DNS d’authentification des e-mails',
    },
    tools: ['cli', 'terraform'],
  },
  {
    slug: 'encrypt-object-storage',
    category: 'storage',
    sidebarLabel: { en: 'Encrypt Object Storage (CLI)', fr: 'Chiffrer le stockage objet (CLI)' },
    tools: ['cli'],
  },
  {
    slug: 'deploy-private-shared-storage',
    category: 'storage',
    sidebarLabel: { en: 'Deploy Private Storage (CLI)', fr: 'Déployer un stockage privé (CLI)' },
    tools: ['cli'],
    minutes: 20,
  },
  {
    slug: 'backup-vaultwarden-restic-object-storage',
    category: 'storage',
    sidebarLabel: {
      en: 'Vaultwarden Backups with restic',
      fr: 'Sauvegardes Vaultwarden avec restic',
    },
    tools: ['cli', 'terraform'],
    minutes: 45,
  },
  {
    slug: 'deploy-ubuntu-employee-desktops',
    category: 'workplace',
    sidebarLabel: {
      en: 'Deploy Employee Desktops (CLI)',
      fr: 'Déployer des postes de travail (CLI)',
    },
    tools: ['cli', 'marketplace'],
    minutes: 30,
  },
  {
    slug: 'connect-desktops-to-storage',
    category: 'workplace',
    sidebarLabel: {
      en: 'Connect Desktops to Storage (CLI)',
      fr: 'Connecter les postes au stockage (CLI)',
    },
    tools: ['cli'],
    minutes: 10,
  },
];
