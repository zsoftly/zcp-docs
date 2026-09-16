/**
 * Marketplace highlights shown in the home page grid.
 *
 * Each entry is a workload people usually buy as a managed service, mapped to
 * the Marketplace images that cover it. `href` must point at a page that
 * exists under `src/content/docs/public-cloud/marketplace/`, since the build
 * validates internal links. `apps` are product names, so they are not
 * translated; `title` and `desc` are.
 *
 * The home page shows the first nine, in three rows of three. The leading
 * entries mirror the professional-services offerings, so the docs and the
 * marketing site name the same things. Reorder this list to change what
 * appears there; the rest stay reachable from the Marketplace index.
 */

/** A single shape in an icon. Only these tags and attributes are rendered. */
export type IconShape =
  | { tag: 'path'; d: string }
  | { tag: 'circle'; cx: string; cy: string; r: string }
  | { tag: 'rect'; width: string; height: string; x: string; y: string; rx?: string }
  | { tag: 'ellipse'; cx: string; cy: string; rx: string; ry: string }
  | { tag: 'polyline'; points: string }
  | { tag: 'line'; x1: string; y1: string; x2: string; y2: string };

export interface MarketplaceHighlight {
  /** Docs path for the category or the lead image. */
  href: string;
  /** Icon badge colour, as a hex value. */
  color: string;
  /**
   * Shapes of a 24x24 stroked icon, as structured data rather than markup, so
   * nothing here is ever injected as raw HTML.
   */
  icon: IconShape[];
  /** Marketplace image names covering this workload. */
  apps: string[];
  title: { en: string; fr: string };
  desc: { en: string; fr: string };
}

export const marketplaceHighlights: MarketplaceHighlight[] = [
  {
    href: '/public-cloud/marketplace/k3s',
    color: '#6366f1',
    icon: [
      { tag: 'circle', cx: '12', cy: '12', r: '10' },
      { tag: 'path', d: 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20' },
      { tag: 'path', d: 'M2 12h20' },
    ],
    apps: ['Docker', 'k3s', 'Rancher'],
    title: { en: 'Container & Kubernetes', fr: 'Conteneurs et Kubernetes' },
    desc: {
      en: 'One container host or a full cluster, on the same tooling.',
      fr: 'Un hôte de conteneurs ou un cluster complet, même outillage.',
    },
  },
  {
    href: '/public-cloud/marketplace/keycloak',
    color: '#06b6d4',
    icon: [
      { tag: 'path', d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
      { tag: 'circle', cx: '12', cy: '10', r: '2.5' },
    ],
    apps: ['Keycloak', 'Authentik'],
    title: { en: 'Identity Management', fr: 'Gestion des identités' },
    desc: {
      en: 'Run the identity provider your applications authenticate against.',
      fr: "Exploitez le fournisseur d'identité de vos applications.",
    },
  },
  {
    href: '/public-cloud/marketplace/networking-vpn',
    color: '#64748b',
    icon: [
      { tag: 'circle', cx: '12', cy: '5', r: '2.5' },
      { tag: 'circle', cx: '5', cy: '19', r: '2.5' },
      { tag: 'circle', cx: '19', cy: '19', r: '2.5' },
      { tag: 'path', d: 'M12 7.5v4m0 0-5.5 5m5.5-5 5.5 5' },
    ],
    apps: ['Tailscale', 'NetBird', 'wg-easy'],
    title: { en: 'Zero Trust VPN', fr: 'VPN Zero Trust' },
    desc: {
      en: 'Mesh networking joining your instances, offices, and clouds.',
      fr: 'Réseau maillé reliant instances, bureaux et nuages.',
    },
  },
  {
    href: '/public-cloud/marketplace/monitoring-automation',
    color: '#22c55e',
    icon: [
      { tag: 'path', d: 'M3 3v18h18' },
      { tag: 'path', d: 'm7 15 4-6 3 4 4-7' },
    ],
    apps: ['Grafana', 'Prometheus', 'Zabbix'],
    title: {
      en: 'Observability & Incident Response',
      fr: 'Observabilité et réponse aux incidents',
    },
    desc: {
      en: 'Metrics, dashboards, and uptime checks with retention you set.',
      fr: 'Métriques, tableaux de bord et disponibilité, rétention au choix.',
    },
  },
  {
    href: '/public-cloud/marketplace/devops-source-control',
    color: '#f97316',
    icon: [
      { tag: 'circle', cx: '18', cy: '18', r: '3' },
      { tag: 'circle', cx: '6', cy: '6', r: '3' },
      { tag: 'path', d: 'M6 21V9a9 9 0 0 0 9 9' },
    ],
    apps: ['GitLab', 'Gitea', 'Forgejo'],
    title: { en: 'DevOps & CI/CD', fr: 'DevOps et CI/CD' },
    desc: {
      en: 'Host repositories and run builds on runners you control.',
      fr: 'Hébergez vos dépôts et vos builds sur vos exécuteurs.',
    },
  },
  {
    href: '/public-cloud/marketplace/ollama',
    color: '#ec4899',
    icon: [
      { tag: 'rect', width: '16', height: '12', x: '4', y: '8', rx: '2' },
      { tag: 'path', d: 'M12 8V4M8 2h8' },
      { tag: 'circle', cx: '9', cy: '14', r: '1' },
      { tag: 'circle', cx: '15', cy: '14', r: '1' },
    ],
    apps: ['Ollama', 'Dify', 'OpenClaw'],
    title: { en: 'AI Agents & Chatbots', fr: 'Agents IA et robots conversationnels' },
    desc: {
      en: 'Serve open models and agent workflows on your own instances.',
      fr: 'Servez modèles ouverts et flux agentiques sur vos instances.',
    },
  },
  {
    href: '/public-cloud/marketplace/databases',
    color: '#3b82f6',
    icon: [
      { tag: 'ellipse', cx: '12', cy: '5', rx: '9', ry: '3' },
      { tag: 'path', d: 'M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5' },
      { tag: 'path', d: 'M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3' },
    ],
    apps: ['PostgreSQL', 'MySQL', 'MariaDB'],
    title: { en: 'Databases', fr: 'Bases de données' },
    desc: {
      en: 'Transactional storage with your own tuning and versions.',
      fr: 'Stockage transactionnel avec vos réglages et vos versions.',
    },
  },
  {
    href: '/public-cloud/marketplace/openbao',
    color: '#14b8a6',
    icon: [
      { tag: 'rect', width: '18', height: '11', x: '3', y: '11', rx: '2' },
      { tag: 'path', d: 'M7 11V7a5 5 0 0 1 10 0v4' },
    ],
    apps: ['OpenBao', 'Vaultwarden'],
    title: { en: 'Security & Compliance', fr: 'Sécurité et conformité' },
    desc: {
      en: 'Keep API keys, certificates, and passwords in your network.',
      fr: "Clés d'API, certificats et mots de passe dans votre réseau.",
    },
  },
  {
    href: '/public-cloud/marketplace/web-stacks',
    color: '#eab308',
    icon: [
      { tag: 'circle', cx: '12', cy: '12', r: '10' },
      { tag: 'path', d: 'M2 12h20' },
      { tag: 'path', d: 'M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20' },
    ],
    apps: ['WordPress', 'Ghost', 'Drupal'],
    title: { en: 'Web Stacks & Publishing', fr: 'Piles web et publication' },
    desc: {
      en: 'Launch blogs, CMS platforms, and marketing sites in minutes.',
      fr: 'Lancez blogues, plateformes CMS et sites vitrines rapidement.',
    },
  },
  {
    href: '/public-cloud/marketplace/valkey',
    color: '#ef4444',
    icon: [{ tag: 'path', d: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z' }],
    apps: ['Valkey', 'RabbitMQ'],
    title: { en: 'Caching & Message Queues', fr: "Cache et files d'attente" },
    desc: {
      en: 'Session stores and background job queues beside your application.',
      fr: 'Sessions et files de tâches de fond à côté de votre application.',
    },
  },
  {
    href: '/public-cloud/marketplace/elasticsearch',
    color: '#f59e0b',
    icon: [
      { tag: 'circle', cx: '11', cy: '11', r: '7' },
      { tag: 'path', d: 'm21 21-4.3-4.3' },
    ],
    apps: ['Elasticsearch', 'ClickHouse', 'Qdrant'],
    title: { en: 'Search & Analytics', fr: 'Recherche et analytique' },
    desc: {
      en: 'Index logs, run analytics queries, and power vector search.',
      fr: 'Indexez vos journaux, vos analyses et la recherche vectorielle.',
    },
  },
  {
    href: '/public-cloud/marketplace/apache-kafka',
    color: '#8b5cf6',
    icon: [{ tag: 'path', d: 'M3 12h4l3-8 4 16 3-8h4' }],
    apps: ['Apache Kafka'],
    title: { en: 'Event Streaming', fr: "Diffusion d'événements" },
    desc: {
      en: 'Durable event logs for pipelines, with retention you set yourself.',
      fr: "Journaux d'événements durables, avec une rétention que vous fixez.",
    },
  },
  {
    href: '/public-cloud/marketplace/harbor',
    color: '#0ea5e9',
    icon: [
      {
        tag: 'path',
        d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
      },
      { tag: 'polyline', points: '3.29 7 12 12 20.71 7' },
    ],
    apps: ['Harbor', 'Nexus', 'Artifactory'],
    title: { en: 'Artifact & Image Registries', fr: "Registres d'artéfacts et d'images" },
    desc: {
      en: 'Store images and build artifacts next to the cluster pulling them.',
      fr: 'Stockez images et artéfacts près du cluster qui les récupère.',
    },
  },
  {
    href: '/public-cloud/marketplace/n8n',
    color: '#a855f7',
    icon: [
      { tag: 'circle', cx: '5', cy: '6', r: '2' },
      { tag: 'circle', cx: '19', cy: '6', r: '2' },
      { tag: 'circle', cx: '12', cy: '18', r: '2' },
      { tag: 'path', d: 'M7 6h10M5 8v4a2 2 0 0 0 2 2h3M19 8v4a2 2 0 0 1-2 2h-3' },
    ],
    apps: ['n8n', 'NocoDB', 'Directus', 'Supabase'],
    title: { en: 'Automation & Internal Tools', fr: 'Automatisation et outils internes' },
    desc: {
      en: 'Wire systems together without paying per task or per record.',
      fr: "Reliez vos systèmes sans payer à la tâche ni à l'enregistrement.",
    },
  },
];
