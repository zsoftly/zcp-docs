// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

export default defineConfig({
  site: 'https://docs.zsoftly.ca',
  integrations: [
    starlight({
      title: 'ZSoftly Docs',
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
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/zsoftly/zcp-cli',
        },
      ],
      customCss: ['./src/styles/custom.css'],
      components: {
        Header: './src/overrides/Header.astro',
        Hero: './src/overrides/Hero.astro',
        ThemeSelect: './src/overrides/ThemeSelect.astro',
        SocialIcons: './src/overrides/SocialIcons.astro',
        Footer: './src/overrides/Footer.astro',
        TableOfContents: './src/overrides/TableOfContents.astro',
        PageFrame: './src/overrides/PageFrame.astro',
      },
      sidebar: [
        // ── ZCP — ZSoftly Cloud Platform (Public Cloud) ───────
        {
          label: 'ZCP — Public Cloud',
          collapsed: false,
          items: [
            {
              label: 'Getting Started',
              collapsed: false,
              items: [
                { label: 'Introduction', slug: 'public-cloud/getting-started/introduction' },
                { label: 'Account Signup', slug: 'public-cloud/getting-started/account-signup' },
                { label: 'Profile Setup', slug: 'public-cloud/getting-started/profile-setup' },
                { label: 'Quickstart', slug: 'public-cloud/getting-started/quickstart' },
              ],
            },
            {
              label: 'Compute',
              collapsed: true,
              items: [
                { label: 'Create Instance', slug: 'public-cloud/compute/create-instance' },
                { label: 'Instance Overview', slug: 'public-cloud/compute/instance-overview' },
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
                    { label: 'Port Forwarding', slug: 'public-cloud/compute/settings/port-forwarding' },
                    { label: 'Startup Scripts', slug: 'public-cloud/compute/settings/startup-scripts' },
                    { label: 'SSH Keys', slug: 'public-cloud/compute/settings/ssh-keys' },
                  ],
                },
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
                    { label: 'Public IPs', slug: 'public-cloud/networking/public-network/public-ips' },
                    { label: 'Egress Rules', slug: 'public-cloud/networking/public-network/egress-rules' },
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
                    { label: 'Create Volume', slug: 'public-cloud/storage/block-storage/create-volume' },
                    { label: 'Snapshots', slug: 'public-cloud/storage/block-storage/snapshots' },
                  ],
                },
                {
                  label: 'Object Storage',
                  collapsed: true,
                  items: [
                    { label: 'Create Bucket', slug: 'public-cloud/storage/object-storage/create-bucket' },
                    { label: 'Access Keys', slug: 'public-cloud/storage/object-storage/access-keys' },
                    { label: 'S3 API Usage', slug: 'public-cloud/storage/object-storage/s3-usage' },
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
            { label: 'Load Balancer', slug: 'public-cloud/load-balancer' },
            {
              label: 'DNS',
              collapsed: true,
              items: [
                { label: 'Domains', slug: 'public-cloud/dns/domains' },
                { label: 'Records', slug: 'public-cloud/dns/records' },
              ],
            },
            {
              label: 'Backups & Snapshots',
              collapsed: true,
              items: [
                { label: 'VM Snapshots', slug: 'public-cloud/backups-snapshots/vm-snapshots' },
                { label: 'Volume Snapshots', slug: 'public-cloud/backups-snapshots/volume-snapshots' },
                { label: 'Backups', slug: 'public-cloud/backups-snapshots/backups' },
              ],
            },
            { label: 'Affinity Groups', slug: 'public-cloud/affinity-groups' },
            { label: 'Auto Scaling', slug: 'public-cloud/auto-scaling' },
            { label: 'Billing', slug: 'public-cloud/billing' },
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
            {
              label: 'API',
              collapsed: true,
              items: [
                { label: 'Authentication', slug: 'public-cloud/api/authentication' },
                { label: 'Quickstart', slug: 'public-cloud/api/quickstart' },
                { label: 'Reference', slug: 'public-cloud/api/reference' },
              ],
            },
          ],
        },

        // ── ZPCP — ZSoftly Private Cloud Platform ─────────────
        {
          label: 'ZPCP — Private Cloud',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'private-cloud/overview' },
            { label: 'Platform Components', slug: 'private-cloud/platform-components' },
            {
              label: 'Getting Started',
              collapsed: true,
              items: [
                { label: 'After Deployment', slug: 'private-cloud/getting-started/after-deployment' },
                { label: 'Accessing CloudStack', slug: 'private-cloud/getting-started/accessing-cloudstack' },
                { label: 'VPN Access', slug: 'private-cloud/getting-started/vpn-access' },
                { label: 'Zone Setup', slug: 'private-cloud/getting-started/zone-setup' },
              ],
            },
            {
              label: 'Reference',
              collapsed: true,
              items: [
                { label: 'Apache CloudStack', slug: 'private-cloud/reference/apache-cloudstack' },
                { label: 'Ceph Storage', slug: 'private-cloud/reference/ceph-storage' },
                { label: 'VPN Connectivity', slug: 'private-cloud/reference/vpn-connectivity' },
                { label: 'Support', slug: 'private-cloud/reference/support' },
              ],
            },
          ],
        },
      ],

      // Algolia DocSearch — uncomment once credentials are issued
      // See: https://starlight.astro.build/guides/site-search/
      // algolia: {
      //   appId: 'REPLACE_WITH_APP_ID',
      //   apiKey: 'REPLACE_WITH_SEARCH_API_KEY',
      //   indexName: 'REPLACE_WITH_INDEX_NAME',
      // },
    }),
  ],
});
