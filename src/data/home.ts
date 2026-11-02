/**
 * Content for the docs home page (`src/components/DocsHome.astro`), in English and French.
 *
 * The home page is a navigation hub. Every card links to a page in both languages. The build fails
 * on a broken link. Paths are site-relative, with no locale prefix and no leading slash. The French
 * page adds `fr/` itself. A path starting with `/` is used as written, for a page in one language
 * only.
 *
 * Spotlight cards name a tutorial by slug. Their title and description come from the tutorial's own
 * page. Their date comes from `tutorialPublishedOn` in `tutorials.ts`. Nothing is copied here. The
 * artwork comes from the capability cards in the zcp-media repository.
 *
 * Icons are copied from Lucide 1.16 (https://lucide.dev, ISC licence), the icon set the website
 * uses through lucide-react, and render through ShapeIcon.
 */

import type { IconShape } from './marketplace-highlights';

export type Localized = { en: string; fr: string };

export interface HomeLink {
  title: Localized;
  desc: Localized;
  path: string;
  /** A 24px outline icon from Lucide (ISC licence), as shapes for ShapeIcon. */
  icon?: IconShape[];
}

export interface HomePlatform {
  label: Localized;
  title: Localized;
  desc: Localized;
  cta: Localized;
  path: string;
}

export interface HomeSpotlight {
  /** Tutorial slug under `tutorials/`. */
  slug: string;
  tag: Localized;
  image: string;
}

export interface HomeTool {
  glyph: string;
  title: Localized;
  desc: Localized;
  /** Omit for Ask Docs, which opens the dialog instead of a page. */
  path?: string;
}

export const homePlatforms: HomePlatform[] = [
  {
    label: { en: 'ZCP · Public Cloud', fr: 'ZCP · Nuage public' },
    title: { en: 'ZSoftly Public Cloud', fr: 'ZSoftly Public Cloud' },
    desc: {
      en: 'Run virtual machines, Kubernetes, networks and storage in Montréal (YUL-1) and Ottawa (YOW-1).',
      fr: 'Exécutez des machines virtuelles, Kubernetes, des réseaux et du stockage à Montréal (YUL-1) et à Ottawa (YOW-1).',
    },
    cta: { en: 'Public Cloud docs', fr: 'Documentation du nuage public' },
    path: 'public-cloud/getting-started/introduction/',
  },
  {
    label: { en: 'ZPCP · Private Cloud', fr: 'ZPCP · Nuage privé' },
    title: { en: 'ZSoftly Private Cloud', fr: 'ZSoftly Private Cloud' },
    desc: {
      en: 'Operate a dedicated cloud on your own hardware or on hardware we host for you.',
      fr: 'Exploitez un nuage dédié sur votre propre matériel ou sur du matériel que nous hébergeons pour vous.',
    },
    cta: { en: 'Private Cloud docs', fr: 'Documentation du nuage privé' },
    path: 'private-cloud/overview/',
  },
  {
    label: { en: 'Cloud Storage', fr: 'Stockage infonuagique' },
    title: { en: 'ZSoftly Cloud Storage', fr: 'ZSoftly Cloud Storage' },
    desc: {
      en: 'Dedicated single-tenant clusters for object, block and file storage, with root access.',
      fr: 'Grappes dédiées à locataire unique pour le stockage objet, bloc et fichier, avec accès racine.',
    },
    cta: { en: 'Cloud Storage docs', fr: 'Documentation du stockage infonuagique' },
    path: 'cloud-storage/overview/',
  },
];

export const homeGetStarted: HomeLink[] = [
  {
    title: { en: 'Deploy your first VM', fr: 'Déployer votre première VM' },
    desc: {
      en: 'Create a server and connect to it over SSH.',
      fr: 'Créez un serveur et connectez-vous en SSH.',
    },
    path: 'public-cloud/getting-started/quickstart/',
    icon: [
      { tag: 'path', d: 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5' },
      {
        tag: 'path',
        d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09',
      },
      {
        tag: 'path',
        d: 'M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z',
      },
      { tag: 'path', d: 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05' },
    ],
  },
  {
    title: { en: 'Install the ZCP CLI', fr: 'Installer le CLI ZCP' },
    desc: {
      en: 'Manage resources from your terminal, with JSON or YAML output.',
      fr: 'Gérez vos ressources depuis le terminal, avec une sortie JSON ou YAML.',
    },
    path: 'public-cloud/cli/installation/',
    icon: [
      { tag: 'path', d: 'm7 11 2-2-2-2' },
      { tag: 'path', d: 'M11 13h4' },
      { tag: 'rect', width: '18', height: '18', x: '3', y: '3', rx: '2' },
    ],
  },
  {
    title: { en: 'Set up a private network', fr: 'Configurer un réseau privé' },
    desc: {
      en: 'Create a VPC, tiers and firewall rules for your workloads.',
      fr: 'Créez un VPC, des niveaux et des règles de pare-feu pour vos charges de travail.',
    },
    path: 'public-cloud/networking/vpc/create-vpc/',
    icon: [
      { tag: 'rect', x: '16', y: '16', width: '6', height: '6', rx: '1' },
      { tag: 'rect', x: '2', y: '16', width: '6', height: '6', rx: '1' },
      { tag: 'rect', x: '9', y: '2', width: '6', height: '6', rx: '1' },
      { tag: 'path', d: 'M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3' },
      { tag: 'path', d: 'M12 12V8' },
    ],
  },
  {
    title: { en: 'Understand billing', fr: 'Comprendre la facturation' },
    desc: {
      en: 'See how we bill compute, storage and IP addresses, and how credits apply.',
      fr: 'Voyez comment nous facturons le calcul, le stockage et les adresses IP, et comment les crédits s’appliquent.',
    },
    path: 'public-cloud/billing/',
    icon: [
      { tag: 'path', d: 'M12 17V7' },
      { tag: 'path', d: 'M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8' },
      {
        tag: 'path',
        d: 'M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z',
      },
    ],
  },
];

export const homeSpotlight: HomeSpotlight[] = [
  {
    slug: 'backup-vaultwarden-restic-object-storage',
    tag: { en: 'New tutorial', fr: 'Nouveau tutoriel' },
    image: '/images/home/security-identity.svg',
  },
  {
    slug: 'deploy-vps-dokploy-cli',
    tag: { en: 'Popular tutorial', fr: 'Tutoriel populaire' },
    image: '/images/home/devops-cicd-automation.svg',
  },
];

export const homeProducts: HomeLink[] = [
  {
    title: { en: 'Compute', fr: 'Calcul' },
    desc: { en: 'Virtual machines and plans', fr: 'Machines virtuelles et forfaits' },
    path: 'public-cloud/compute/',
    icon: [
      { tag: 'rect', width: '20', height: '8', x: '2', y: '2', rx: '2' },
      { tag: 'rect', width: '20', height: '8', x: '2', y: '14', rx: '2' },
      { tag: 'line', x1: '6', x2: '6.01', y1: '6', y2: '6' },
      { tag: 'line', x1: '6', x2: '6.01', y1: '18', y2: '18' },
    ],
  },
  {
    title: { en: 'Kubernetes', fr: 'Kubernetes' },
    desc: { en: 'Managed clusters and kubectl', fr: 'Grappes gérées et kubectl' },
    path: 'public-cloud/kubernetes/',
    icon: [
      { tag: 'circle', cx: '12', cy: '12', r: '8' },
      { tag: 'path', d: 'M12 2v7.5' },
      { tag: 'path', d: 'm19 5-5.23 5.23' },
      { tag: 'path', d: 'M22 12h-7.5' },
      { tag: 'path', d: 'm19 19-5.23-5.23' },
      { tag: 'path', d: 'M12 14.5V22' },
      { tag: 'path', d: 'M10.23 13.77 5 19' },
      { tag: 'path', d: 'M9.5 12H2' },
      { tag: 'path', d: 'M10.23 10.23 5 5' },
      { tag: 'circle', cx: '12', cy: '12', r: '2.5' },
    ],
  },
  {
    title: { en: 'Block storage', fr: 'Stockage bloc' },
    desc: { en: 'Volumes, root disks and tiers', fr: 'Volumes, disques racine et niveaux' },
    path: 'public-cloud/storage/block-storage/create-volume/',
    icon: [
      { tag: 'path', d: 'M10 16h.01' },
      {
        tag: 'path',
        d: 'M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
      },
      { tag: 'path', d: 'M21.946 12.013H2.054' },
      { tag: 'path', d: 'M6 16h.01' },
    ],
  },
  {
    title: { en: 'Object storage', fr: 'Stockage objet' },
    desc: { en: 'S3-compatible buckets and keys', fr: 'Compartiments et clés compatibles S3' },
    path: 'public-cloud/storage/object-storage/create-bucket/',
    icon: [
      { tag: 'rect', width: '20', height: '5', x: '2', y: '3', rx: '1' },
      { tag: 'path', d: 'M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8' },
      { tag: 'path', d: 'M10 12h4' },
    ],
  },
  {
    title: { en: 'Networking and VPC', fr: 'Réseau et VPC' },
    desc: { en: 'Networks, IP addresses and firewall', fr: 'Réseaux, adresses IP et pare-feu' },
    path: 'public-cloud/networking/',
    icon: [
      { tag: 'rect', x: '16', y: '16', width: '6', height: '6', rx: '1' },
      { tag: 'rect', x: '2', y: '16', width: '6', height: '6', rx: '1' },
      { tag: 'rect', x: '9', y: '2', width: '6', height: '6', rx: '1' },
      { tag: 'path', d: 'M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3' },
      { tag: 'path', d: 'M12 12V8' },
    ],
  },
  {
    title: { en: 'Load balancer', fr: 'Répartiteur de charge' },
    desc: {
      en: 'Distribute traffic across servers',
      fr: 'Répartir le trafic entre plusieurs serveurs',
    },
    path: 'public-cloud/load-balancer/',
    icon: [
      { tag: 'path', d: 'M16 3h5v5' },
      { tag: 'path', d: 'M8 3H3v5' },
      { tag: 'path', d: 'M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3' },
      { tag: 'path', d: 'm15 9 6-6' },
    ],
  },
  {
    title: { en: 'DNS', fr: 'DNS' },
    desc: { en: 'Zones and records', fr: 'Zones et enregistrements' },
    path: 'public-cloud/dns/overview/',
    icon: [
      { tag: 'circle', cx: '12', cy: '12', r: '10' },
      { tag: 'path', d: 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20' },
      { tag: 'path', d: 'M2 12h20' },
    ],
  },
  {
    title: { en: 'Backups and snapshots', fr: 'Sauvegardes et instantanés' },
    desc: { en: 'Protect VMs and volumes', fr: 'Protéger les VM et les volumes' },
    path: 'public-cloud/backups-snapshots/backups/',
    icon: [
      { tag: 'path', d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' },
      { tag: 'path', d: 'M3 3v5h5' },
      { tag: 'path', d: 'M12 7v5l4 2' },
    ],
  },
  {
    title: { en: 'Auto scaling', fr: 'Mise à l’échelle automatique' },
    desc: { en: 'Grow and shrink with demand', fr: 'Ajuster la capacité selon la demande' },
    path: 'public-cloud/auto-scaling/',
    icon: [
      { tag: 'path', d: 'M14.828 14.828 21 21' },
      { tag: 'path', d: 'M21 16v5h-5' },
      { tag: 'path', d: 'm21 3-9 9-4-4-6 6' },
      { tag: 'path', d: 'M21 8V3h-5' },
    ],
  },
  {
    title: { en: 'IAM and projects', fr: 'IAM et projets' },
    desc: { en: 'Users, roles and projects', fr: 'Utilisateurs, rôles et projets' },
    path: 'public-cloud/iam/overview/',
    icon: [
      { tag: 'path', d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' },
      { tag: 'path', d: 'M16 3.128a4 4 0 0 1 0 7.744' },
      { tag: 'path', d: 'M22 21v-2a4 4 0 0 0-3-3.87' },
      { tag: 'circle', cx: '9', cy: '7', r: '4' },
    ],
  },
  {
    title: { en: 'Marketplace', fr: 'Marketplace' },
    desc: { en: 'Preconfigured VM images', fr: 'Images de VM préconfigurées' },
    path: 'public-cloud/marketplace/',
    icon: [
      { tag: 'path', d: 'M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5' },
      {
        tag: 'path',
        d: 'M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244',
      },
      { tag: 'path', d: 'M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05' },
    ],
  },
  {
    title: { en: 'Billing', fr: 'Facturation' },
    desc: { en: 'Pricing, invoices and credits', fr: 'Tarifs, factures et crédits' },
    path: 'public-cloud/billing/',
    icon: [
      { tag: 'path', d: 'M12 17V7' },
      { tag: 'path', d: 'M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8' },
      {
        tag: 'path',
        d: 'M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z',
      },
    ],
  },
];

export const homeTools: HomeTool[] = [
  {
    glyph: '>_',
    title: { en: 'ZCP CLI', fr: 'CLI ZCP' },
    desc: {
      en: 'Manage your cloud from the terminal.',
      fr: 'Gérez votre nuage depuis le terminal.',
    },
    path: 'public-cloud/cli/quickstart/',
  },
  {
    glyph: 'TF',
    title: { en: 'Terraform / OpenTofu provider', fr: 'Fournisseur Terraform / OpenTofu' },
    desc: {
      en: 'zsoftly/zcp on the Terraform and OpenTofu registries.',
      fr: 'zsoftly/zcp dans les registres Terraform et OpenTofu.',
    },
    // English only for now, so the French page links to the English tutorial.
    path: '/tutorials/manage-infrastructure-terraform/',
  },
  {
    glyph: '{ }',
    title: { en: 'REST API', fr: 'API REST' },
    desc: {
      en: 'Browse the reference in Swagger UI.',
      fr: 'Référence avec Swagger UI interactif.',
    },
    path: 'public-cloud/api/reference/',
  },
  {
    glyph: 'AI',
    title: { en: 'Ask Docs', fr: 'Demander aux docs' },
    desc: {
      en: 'Open a question in ChatGPT, Claude or Cursor.',
      fr: 'Ouvrez une question dans ChatGPT, Claude ou Cursor.',
    },
  },
];

/** Number of release notes shown on the home page, taken from the changelog feed. */
export const HOME_RELEASE_COUNT = 4;
