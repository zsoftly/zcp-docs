// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

/** @type {Record<string, string>} */
const frSidebarLabels = {
  Changelog: 'Journal des modifications',
  Tutorials: 'Tutoriels',
  'Deploy a VPS with Dokploy (CLI)': 'Déployer un VPS avec Dokploy (CLI)',
  Installation: 'Installation',
  Quickstart: 'Démarrage rapide',
  Configuration: 'Configuration',
  Reference: 'Référence',
  Authentication: 'Authentification',
  'Getting Started': 'Premiers pas',
  Introduction: 'Introduction',
  'Account Signup': 'Création de compte',
  'Profile Setup': 'Configuration du profil',
  Regions: 'Régions',
  Projects: 'Projets',
  Overview: "Vue d'ensemble",
  Users: 'Utilisateurs',
  'Roles & Permissions': 'Rôles et autorisations',
  'Account Security': 'Sécurité du compte',
  Compute: 'Calcul',
  'Create Instance': 'Créer une instance',
  'Instance Overview': "Vue d'ensemble de l'instance",
  'Plan Names': 'Noms des plans',
  'Instance Types': "Types d'instances",
  'Connect via SSH': 'Connexion par SSH',
  'Connect via RDP': 'Connexion par RDP',
  'Console Access': 'Accès console',
  'Power Management': "Gestion de l'alimentation",
  'Activity Logs': "Journaux d'activité",
  'Instance Settings': "Paramètres de l'instance",
  'Block Storage': 'Stockage bloc',
  'Resize Plan': 'Redimensionner le plan',
  'Change OS': 'Changer le système',
  Firewall: 'Pare-feu',
  Networks: 'Réseaux',
  'Port Forwarding': 'Redirection de ports',
  'Startup Scripts': 'Scripts de démarrage',
  'SSH Keys': 'Clés SSH',
  'Load Balancer': 'Répartiteur de charge',
  'Affinity Groups': "Groupes d'affinité",
  'Auto Scaling': "Mise à l'échelle automatique",
  'VM Snapshots': 'Instantanés de VM',
  Backups: 'Sauvegardes',
  Networking: 'Réseautage',
  'Public Network': 'Réseau public',
  Create: 'Créer',
  'Public IPs': 'IP publiques',
  'Egress Rules': 'Règles de sortie',
  VPC: 'VPC',
  'Create VPC': 'Créer un VPC',
  'Add Subnet': 'Ajouter un sous-réseau',
  'Network ACLs': 'ACL réseau',
  'VPN Gateway': 'Passerelle VPN',
  'VPN Users': 'Utilisateurs VPN',
  Storage: 'Stockage',
  'Create Volume': 'Créer un volume',
  'Volume Snapshots': 'Instantanés de volume',
  'Object Storage': 'Stockage objet',
  'Create Bucket': 'Créer un compartiment',
  'Access Keys': "Clés d'accès",
  'S3 API Usage': "Utilisation de l'API S3",
  'CLI & Advanced Features': 'CLI et fonctionnalités avancées',
  Kubernetes: 'Kubernetes',
  'Create Cluster': 'Créer un cluster',
  'Cluster Overview': "Vue d'ensemble du cluster",
  'kubectl Access': 'Accès kubectl',
  'Dashboard Access': 'Accès au tableau de bord',
  DNS: 'DNS',
  Domains: 'Domaines',
  Records: 'Enregistrements',
  Marketplace: 'Marketplace',
  Databases: 'Bases de données',
  'Web Stacks': 'Piles Web',
  'Monitoring & Automation': 'Surveillance et automatisation',
  'Developer Tools': 'Outils de développement',
  'DevOps & Source Control': 'DevOps et contrôle de source',
  'Networking & VPN': 'Réseautage et VPN',
  'Control Panels': 'Panneaux de contrôle',
  'Private Cloud': 'Nuage privé',
  'Platform Components': 'Composants de plateforme',
  'After Deployment': 'Après le déploiement',
  'Accessing CloudStack': 'Accéder à CloudStack',
  'VPN Access': 'Accès VPN',
  'Zone Setup': 'Configuration des zones',
  'Apache CloudStack': 'Apache CloudStack',
  OpenStack: 'OpenStack',
  'Ceph Storage': 'Stockage Ceph',
  'VPN Connectivity': 'Connectivité VPN',
  'Identity & SSO': 'Identité et SSO',
  Support: 'Soutien',
  'Cloud Storage': 'Stockage infonuagique',
  'Provisioning a Cluster': 'Provisionner un cluster',
  'Accessing Your Cluster': 'Accéder à votre cluster',
  'Object Storage (S3)': 'Stockage objet (S3)',
  'Block Storage (RBD)': 'Stockage bloc (RBD)',
  'File Storage (CephFS)': 'Stockage fichier (CephFS)',
  'Replication & DR': 'Réplication et reprise après sinistre',
  'Performance & Tiering': 'Performance et hiérarchisation',
  'Ceph Versions': 'Versions de Ceph',
  Billing: 'Facturation',
  Troubleshooting: 'Dépannage',
  'Detach/Delete Blocked by Snapshot': 'Détachement/suppression bloqués par un instantané',
};

/**
 * @param {any[]} items
 * @returns {any[]}
 */
function translateSidebar(items) {
  return items.map((item) => {
    if (typeof item === 'string' || !('label' in item)) return item;

    const translation = frSidebarLabels[item.label];
    const translated = translation
      ? { ...item, translations: { ...(item.translations ?? {}), fr: translation } }
      : { ...item };

    if ('items' in translated && Array.isArray(translated.items)) {
      translated.items = translateSidebar(translated.items);
    }

    return translated;
  });
}

export default defineConfig({
  // Prod builds (iaas play, no PUBLIC_SITE_URL) resolve to the canonical host;
  // dev/stg Docker builds set PUBLIC_SITE_URL to their own host.
  site: process.env.PUBLIC_SITE_URL ?? 'https://docs.zcp.zsoftly.ca',
  integrations: [
    starlight({
      title: {
        en: 'ZSoftly Docs',
        fr: 'Documentation ZSoftly',
      },
      locales: {
        root: { label: 'English', lang: 'en' },
        fr: { label: 'Français', lang: 'fr' },
      },
      // Fails the build on broken internal links (404s, bad anchors).
      // errorOnRelativeLinks: false — our content uses relative links (./page,
      // ../section) which resolve correctly; we only want to catch real breakage.
      plugins: [starlightLinksValidator({ errorOnRelativeLinks: false })],
      logo: {
        light: './public/logo.png',
        dark: './public/logo-dark.png',
        replacesTitle: true,
      },
      favicon: '/favicon.svg',
      lastUpdated: true,
      // Expressive Code is configured via ec.config.mjs in the project root.
      // astro-expressive-code auto-discovers that file via loadEcConfigFile()
      // in its astro:config:setup hook — no expressiveCode key is needed here.
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/zsoftly/zcp-docs',
        },
      ],
      customCss: ['./src/styles/custom.css'],
      components: {
        Head: './src/overrides/Head.astro',
        Header: './src/overrides/Header.astro',
        Hero: './src/overrides/Hero.astro',
        ThemeSelect: './src/overrides/ThemeSelect.astro',
        SocialIcons: './src/overrides/SocialIcons.astro',
        Footer: './src/overrides/Footer.astro',
        TableOfContents: './src/overrides/TableOfContents.astro',
        PageFrame: './src/overrides/PageFrame.astro',
      },
      sidebar: translateSidebar([
        // ── Changelog ──────────────────────────────────────────
        { label: 'Changelog', slug: 'changelog' },

        // ── Tutorials ──────────────────────────────────────────
        {
          label: 'Tutorials',
          collapsed: false,
          items: [
            { label: 'Overview', slug: 'tutorials' },
            { label: 'Deploy a VPS with Dokploy (CLI)', slug: 'tutorials/deploy-vps-dokploy-cli' },
            {
              label: 'Deploy OpenClaw (Marketplace, CLI)',
              slug: 'tutorials/deploy-openclaw-marketplace-cli',
            },
          ],
        },

        // ── CLI ────────────────────────────────────────────────
        {
          label: 'CLI',
          collapsed: true,
          items: [
            { label: 'Installation', slug: 'public-cloud/cli/installation' },
            { label: 'Quickstart', slug: 'public-cloud/cli/quickstart' },
            { label: 'Configuration', slug: 'public-cloud/cli/configuration' },
            { label: 'Reference', slug: 'public-cloud/cli/reference' },
          ],
        },

        // ── API ────────────────────────────────────────────────
        {
          label: 'API',
          collapsed: true,
          items: [
            { label: 'Authentication', slug: 'public-cloud/api/authentication' },
            { label: 'Quickstart', slug: 'public-cloud/api/quickstart' },
            { label: 'Reference', slug: 'public-cloud/api/reference' },
          ],
        },

        // ── ZCP — Public Cloud ─────────────────────────────────
        {
          label: 'ZCP',
          collapsed: false,
          items: [
            {
              label: 'Getting Started',
              collapsed: false,
              items: [
                { label: 'Introduction', slug: 'public-cloud/getting-started/introduction' },
                { label: 'Account Signup', slug: 'public-cloud/getting-started/account-signup' },
                { label: 'Profile Setup', slug: 'public-cloud/getting-started/profile-setup' },
                { label: 'Regions', slug: 'public-cloud/getting-started/regions' },
                { label: 'Quickstart', slug: 'public-cloud/getting-started/quickstart' },
              ],
            },
            { label: 'Projects', slug: 'public-cloud/projects' },
            {
              label: 'IAM',
              collapsed: true,
              items: [
                { label: 'Overview', slug: 'public-cloud/iam/overview' },
                { label: 'Users', slug: 'public-cloud/iam/users' },
                { label: 'Roles & Permissions', slug: 'public-cloud/iam/roles' },
                { label: 'Account Security', slug: 'public-cloud/iam/security' },
              ],
            },
            {
              label: 'Compute',
              collapsed: true,
              items: [
                { label: 'Create Instance', slug: 'public-cloud/compute/create-instance' },
                { label: 'Instance Overview', slug: 'public-cloud/compute/instance-overview' },
                { label: 'Plan Names', slug: 'public-cloud/compute/plan-names' },
                { label: 'Instance Types', slug: 'public-cloud/compute/instance-types' },
                { label: 'Connect via SSH', slug: 'public-cloud/compute/connect-ssh' },
                { label: 'Connect via RDP', slug: 'public-cloud/compute/connect-rdp' },
                { label: 'Console Access', slug: 'public-cloud/compute/console-access' },
                { label: 'Power Management', slug: 'public-cloud/compute/power-management' },
                { label: 'Activity Logs', slug: 'public-cloud/compute/activity-logs' },
                {
                  label: 'Instance Settings',
                  collapsed: true,
                  items: [
                    { label: 'Block Storage', slug: 'public-cloud/compute/settings/block-storage' },
                    { label: 'Resize Plan', slug: 'public-cloud/compute/settings/resize-plan' },
                    { label: 'Change OS', slug: 'public-cloud/compute/settings/change-os' },
                    { label: 'Firewall', slug: 'public-cloud/compute/settings/firewall' },
                    { label: 'Networks', slug: 'public-cloud/compute/settings/networks' },
                    {
                      label: 'Port Forwarding',
                      slug: 'public-cloud/compute/settings/port-forwarding',
                    },
                    {
                      label: 'Startup Scripts',
                      slug: 'public-cloud/compute/settings/startup-scripts',
                    },
                    { label: 'SSH Keys', slug: 'public-cloud/compute/settings/ssh-keys' },
                  ],
                },
                { label: 'Load Balancer', slug: 'public-cloud/load-balancer' },
                { label: 'Affinity Groups', slug: 'public-cloud/affinity-groups' },
                { label: 'Auto Scaling', slug: 'public-cloud/auto-scaling' },
                { label: 'VM Snapshots', slug: 'public-cloud/backups-snapshots/vm-snapshots' },
                { label: 'Backups', slug: 'public-cloud/backups-snapshots/backups' },
              ],
            },
            {
              label: 'Networking',
              collapsed: true,
              items: [
                {
                  label: 'Public Network',
                  collapsed: true,
                  items: [
                    { label: 'Create', slug: 'public-cloud/networking/public-network/create' },
                    { label: 'Overview', slug: 'public-cloud/networking/public-network/overview' },
                    {
                      label: 'Public IPs',
                      slug: 'public-cloud/networking/public-network/public-ips',
                    },
                    {
                      label: 'Egress Rules',
                      slug: 'public-cloud/networking/public-network/egress-rules',
                    },
                  ],
                },
                {
                  label: 'VPC',
                  collapsed: true,
                  items: [
                    { label: 'Create VPC', slug: 'public-cloud/networking/vpc/create-vpc' },
                    { label: 'Add Subnet', slug: 'public-cloud/networking/vpc/add-subnet' },
                    { label: 'Network ACLs', slug: 'public-cloud/networking/vpc/network-acls' },
                    { label: 'Public IPs', slug: 'public-cloud/networking/vpc/public-ips' },
                    { label: 'VPN Gateway', slug: 'public-cloud/networking/vpc/site-vpn' },
                    { label: 'VPN Users', slug: 'public-cloud/networking/vpc/vpn-users' },
                  ],
                },
              ],
            },
            {
              label: 'Storage',
              collapsed: true,
              items: [
                {
                  label: 'Block Storage',
                  collapsed: true,
                  items: [
                    {
                      label: 'Create Volume',
                      slug: 'public-cloud/storage/block-storage/create-volume',
                    },
                    {
                      label: 'Volume Snapshots',
                      slug: 'public-cloud/storage/block-storage/snapshots',
                    },
                  ],
                },
                {
                  label: 'Object Storage',
                  collapsed: true,
                  items: [
                    {
                      label: 'Create Bucket',
                      slug: 'public-cloud/storage/object-storage/create-bucket',
                    },
                    {
                      label: 'Access Keys',
                      slug: 'public-cloud/storage/object-storage/access-keys',
                    },
                    { label: 'S3 API Usage', slug: 'public-cloud/storage/object-storage/s3-usage' },
                    {
                      label: 'CLI & Advanced Features',
                      slug: 'public-cloud/storage/object-storage/cli',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Kubernetes',
              collapsed: true,
              items: [
                { label: 'Create Cluster', slug: 'public-cloud/kubernetes/create-cluster' },
                { label: 'Cluster Overview', slug: 'public-cloud/kubernetes/cluster-overview' },
                { label: 'kubectl Access', slug: 'public-cloud/kubernetes/kubectl-access' },
                { label: 'Dashboard Access', slug: 'public-cloud/kubernetes/dashboard-access' },
              ],
            },
            {
              label: 'DNS',
              collapsed: true,
              items: [
                { label: 'Domains', slug: 'public-cloud/dns/domains' },
                { label: 'Records', slug: 'public-cloud/dns/records' },
              ],
            },
            {
              label: 'Marketplace',
              collapsed: true,
              items: [
                { label: 'Overview', slug: 'public-cloud/marketplace' },
                {
                  label: 'Databases',
                  collapsed: true,
                  items: [
                    { label: 'MongoDB 8.0', slug: 'public-cloud/marketplace/mongodb' },
                    { label: 'MariaDB 11.4', slug: 'public-cloud/marketplace/mariadb' },
                    { label: 'MySQL 8.4', slug: 'public-cloud/marketplace/mysql' },
                    { label: 'PostgreSQL 17', slug: 'public-cloud/marketplace/postgresql' },
                    { label: 'Valkey 9.0', slug: 'public-cloud/marketplace/valkey' },
                    { label: 'Elasticsearch 8', slug: 'public-cloud/marketplace/elasticsearch' },
                    { label: 'InfluxDB 2', slug: 'public-cloud/marketplace/influxdb' },
                  ],
                },
                {
                  label: 'Web Stacks',
                  collapsed: true,
                  items: [
                    { label: 'WordPress', slug: 'public-cloud/marketplace/wordpress' },
                    { label: 'LAMP Stack', slug: 'public-cloud/marketplace/lamp' },
                    { label: 'LEMP Stack', slug: 'public-cloud/marketplace/lemp' },
                  ],
                },
                {
                  label: 'Monitoring & Automation',
                  collapsed: true,
                  items: [
                    { label: 'Grafana', slug: 'public-cloud/marketplace/grafana' },
                    { label: 'n8n', slug: 'public-cloud/marketplace/n8n' },
                  ],
                },
                {
                  label: 'Developer Tools',
                  collapsed: true,
                  items: [
                    { label: 'Docker', slug: 'public-cloud/marketplace/docker' },
                    { label: 'Node.js 24', slug: 'public-cloud/marketplace/nodejs' },
                    { label: 'OpenClaw', slug: 'public-cloud/marketplace/openclaw' },
                  ],
                },
                {
                  label: 'DevOps & Source Control',
                  collapsed: true,
                  items: [{ label: 'GitLab CE 18.11', slug: 'public-cloud/marketplace/gitlab' }],
                },
                {
                  label: 'Networking & VPN',
                  collapsed: true,
                  items: [
                    { label: 'Tailscale', slug: 'public-cloud/marketplace/tailscale' },
                    { label: 'NetBird', slug: 'public-cloud/marketplace/netbird' },
                  ],
                },
                {
                  label: 'Control Panels',
                  collapsed: true,
                  items: [{ label: 'cPanel', slug: 'public-cloud/marketplace/cpanel' }],
                },
              ],
            },
          ],
        },

        // ── ZPCP — Private Cloud ───────────────────────────────
        {
          label: 'ZPCP',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'private-cloud/overview' },
            { label: 'Platform Components', slug: 'private-cloud/platform-components' },
            {
              label: 'Getting Started',
              collapsed: true,
              items: [
                {
                  label: 'After Deployment',
                  slug: 'private-cloud/getting-started/after-deployment',
                },
                {
                  label: 'Accessing CloudStack',
                  slug: 'private-cloud/getting-started/accessing-cloudstack',
                },
                { label: 'VPN Access', slug: 'private-cloud/getting-started/vpn-access' },
                { label: 'Zone Setup', slug: 'private-cloud/getting-started/zone-setup' },
              ],
            },
            {
              label: 'Reference',
              collapsed: true,
              items: [
                { label: 'Apache CloudStack', slug: 'private-cloud/reference/apache-cloudstack' },
                { label: 'OpenStack', slug: 'private-cloud/reference/openstack' },
                { label: 'Ceph Storage', slug: 'private-cloud/reference/ceph-storage' },
                { label: 'VPN Connectivity', slug: 'private-cloud/reference/vpn-connectivity' },
                { label: 'Identity & SSO', slug: 'private-cloud/reference/identity-sso' },
              ],
            },
            { label: 'Support', slug: 'private-cloud/reference/support' },
          ],
        },

        // ── ZCS — Cloud Storage ────────────────────────────────
        {
          label: 'ZCS',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'cloud-storage/overview' },
            {
              label: 'Getting Started',
              collapsed: true,
              items: [
                {
                  label: 'Provisioning a Cluster',
                  slug: 'cloud-storage/getting-started/provisioning',
                },
                {
                  label: 'Accessing Your Cluster',
                  slug: 'cloud-storage/getting-started/accessing-your-cluster',
                },
              ],
            },
            {
              label: 'Reference',
              collapsed: true,
              items: [
                { label: 'Object Storage (S3)', slug: 'cloud-storage/reference/object-storage' },
                { label: 'Block Storage (RBD)', slug: 'cloud-storage/reference/block-storage' },
                { label: 'File Storage (CephFS)', slug: 'cloud-storage/reference/file-storage' },
                { label: 'Replication & DR', slug: 'cloud-storage/reference/replication-dr' },
                {
                  label: 'Performance & Tiering',
                  slug: 'cloud-storage/reference/performance-tiering',
                },
                { label: 'Ceph Versions', slug: 'cloud-storage/reference/ceph-versions' },
              ],
            },
          ],
        },

        // ── Billing ────────────────────────────────────────────
        {
          label: 'Billing',
          items: [{ label: 'Billing', slug: 'public-cloud/billing' }],
        },

        // ── Troubleshooting ────────────────────────────────────
        {
          label: 'Troubleshooting',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'troubleshooting' },
            {
              label: 'Detach/Delete Blocked by Snapshot',
              slug: 'troubleshooting/detach-blocked-by-snapshot',
            },
          ],
        },
      ]),

      // Algolia DocSearch — uncomment once credentials are issued
      // See: https://starlight.astro.build/guides/site-search/
      // algolia: {
      //   appId: 'REPLACE_WITH_APP_ID',
      //   apiKey: 'REPLACE_WITH_SEARCH_API_KEY',
      //   indexName: 'REPLACE_WITH_INDEX_NAME',
      // },
    }),
  ],

  vite: {
    build: {
      rollupOptions: {
        // Silence a harmless Rollup warning from Expressive Code's prebuilt
        // dist: @expressive-code/core re-exports CONTINUE/EXIT from
        // unist-util-visit-parents but doesn't use them in this bundle. Scoped
        // narrowly to that exact import so our own unused-import warnings still
        // surface. Upstream issue in @expressive-code/core@0.42.0.
        onwarn(warning, defaultHandler) {
          if (
            warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
            warning.exporter === 'unist-util-visit-parents'
          ) {
            return;
          }
          defaultHandler(warning);
        },
      },
    },
  },
});
