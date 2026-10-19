export type ChangelogFeedEntry = {
  title: string;
  // French title. Set it only once the entry exists in the French changelog, so French pages
  // never link to a missing anchor. Entries without it are left out of French lists.
  titleFr?: string;
  description: string;
  // Publication calendar date in YYYY-MM-DD format, not a release timestamp.
  pubDate: string;
  slug: string;
};

// Changelog dates are publication calendar dates, not recorded release times.
// Parse them explicitly in UTC so rendering does not vary with the build host's timezone.
export const publicationDateAtUtcMidnight = (date: string) => new Date(`${date}T00:00:00Z`);

// RSS uses noon UTC to preserve the existing feed publication instant.
export const publicationDateAtUtcNoon = (date: string) => new Date(`${date}T12:00:00Z`);

export const changelogFeedEntries: ChangelogFeedEntry[] = [
  {
    title: 'CLI v1.1.0: block storage snapshot schedules',
    titleFr: "CLI v1.1.0 : planifications d'instantanés de stockage bloc",
    description:
      'The zcp CLI adds commands to create and manage recurring block storage snapshot schedules, including pause, resume, and immediate snapshot runs.',
    pubDate: '2026-10-19',
    slug: 'cli-v1.1.0',
  },
  {
    title: 'Terraform / OpenTofu provider v1.1.0',
    titleFr: 'Fournisseur Terraform / OpenTofu v1.1.0',
    description:
      'The provider adds zcp_volume_snapshot_schedule for recurring block storage snapshots, with import, pause and resume support.',
    pubDate: '2026-10-19',
    slug: 'terraform-v1.1.0',
  },
  {
    title: 'ZCP Store',
    titleFr: 'ZCP Store',
    description:
      'Buy support plans, professional services, bare metal servers and licences from the Store tab in the console. Products are account level and bill on the same invoice as your instances.',
    pubDate: '2026-10-11',
    slug: 'zcp-store',
  },
  {
    title: 'Longer instance passwords',
    titleFr: "Mots de passe d'instance plus longs",
    description:
      'New instances and password resets return a random sixteen character provisioning password instead of six.',
    pubDate: '2026-10-11',
    slug: 'instance-password-length',
  },
  {
    title: 'CLI v1.0.1: lifecycle-route and volume fixes',
    titleFr: 'CLI v1.0.1 : correctifs des routes de cycle de vie et des volumes',
    description:
      'The current zcp CLI release uses the current instance cancellation and hostname routes, retrieves every VM snapshot page, and accepts a named storage plan with an explicit volume capacity.',
    pubDate: '2026-10-11',
    slug: 'cli-v1.0.1',
  },
  {
    title: 'CLI v1.0.0: separate root storage and backup schedules',
    titleFr: 'CLI v1.0.0 : stockage racine séparé et planifications de sauvegarde',
    description:
      'New instances and Kubernetes clusters select compute and root storage separately. The CLI also adds VM backup schedules and complete DNS listings.',
    pubDate: '2026-10-11',
    slug: 'cli-v1.0.0',
  },
  {
    title: 'Terraform / OpenTofu provider v1.0.0',
    titleFr: 'Fournisseur Terraform / OpenTofu v1.0.0',
    description:
      'The provider adds named compute and root-storage selections, split Kubernetes plans, VM backup schedules, paginated DNS lookups, and named volume capacity.',
    pubDate: '2026-10-11',
    slug: 'terraform-v1.0.0',
  },
  {
    title: 'Compute and storage sold separately',
    titleFr: 'Calcul et stockage vendus séparément',
    description:
      'VM plans now cover CPU and memory only. Choose the root disk as a per-GB block storage volume when you create the server. Existing servers keep their plan and price.',
    pubDate: '2026-10-11',
    slug: 'compute-storage-separate',
  },
  {
    title: 'CLI v0.0.31: ACL rule pagination and dependency security updates',
    titleFr: 'CLI v0.0.31 : pagination des règles ACL et mises à jour de sécurité',
    description:
      'zcp acl rules reads every API page by default, with --max-items, --starting-token, --page-size and --no-paginate to control a listing. The CLI builds with Go 1.26.9 and updates golang.org/x/net to v0.60.0.',
    pubDate: '2026-10-09',
    slug: 'cli-v0.0.31',
  },
  {
    title: 'CLI v0.0.30: custom VM plans and object storage keys',
    titleFr: 'CLI v0.0.30 : forfaits personnalisés et clés de stockage objet',
    description:
      'The zcp CLI supports custom VM plans, load balancer rule listings, and S3-compatible object storage key rotation. New S3 credentials are visible for five minutes and direct S3 commands validate the saved access key for the selected store.',
    pubDate: '2026-10-03',
    slug: 'cli-v0.0.30',
  },
  {
    title: 'Terraform / OpenTofu provider v0.2.0',
    titleFr: 'Fournisseur Terraform / OpenTofu v0.2.0',
    description:
      'The provider adds object storage bucket configuration resources, VPC and multi-network instances, and volume lookups. It also fixes volume-backup reads, VM-backup destruction, interval validation, and volume-list pagination.',
    pubDate: '2026-09-07',
    slug: 'terraform-v0.2.0',
  },
  {
    title: 'CLI v0.0.29: complete volume listings',
    titleFr: 'CLI v0.0.29 : listes de volumes complètes',
    description:
      'The zcp CLI and SDK now retrieve every page in volume listings and return explicit pagination errors. When a VPC reaches its subnet limit, the CLI directs you to request a quota increase before retrying.',
    pubDate: '2026-09-07',
    slug: 'cli-v0.0.29',
  },
  {
    title: 'Up to 8 subnets per VPC',
    titleFr: "Jusqu'à 8 sous-réseaux par VPC",
    description:
      'Each VPC supports up to 8 subnets, up from 3. Existing VPCs get the new limit with no changes. Raise a support ticket if a workload needs more.',
    pubDate: '2026-09-07',
    slug: 'vpc-subnet-limit',
  },
  {
    title: 'CLI v0.0.28: security fixes and working backups',
    titleFr: 'CLI v0.0.28 : correctifs de sécurité et sauvegardes fonctionnelles',
    description:
      'The zcp CLI redacts credentials from --debug output. It fixes the backup and vm-backup commands and makes instance ssh prefer the public IP.',
    pubDate: '2026-09-07',
    slug: 'cli-v0.0.28',
  },
  {
    title: 'Object storage endpoint DNS resolution from VPCs',
    titleFr: 'Résolution DNS du point de terminaison de stockage objet depuis les VPC',
    description:
      'Fixed DNS configuration for newly created VPCs. Workloads in these VPCs now resolve the object storage endpoint.',
    pubDate: '2026-09-06',
    slug: 'object-storage-vpc-dns-resolution',
  },
  {
    title: 'Kubernetes 1.37 is available',
    titleFr: 'Kubernetes 1.37 est disponible',
    description:
      'Kubernetes 1.37 is now available for new managed clusters, along with refreshed patch releases for the 1.34, 1.35, and 1.36 lines. The default version for new clusters is 1.36.4.',
    pubDate: '2026-09-06',
    slug: 'kubernetes-1.37',
  },
  {
    title: 'Postpaid billing is available',
    titleFr: 'La facturation postpayée est disponible',
    description:
      'Customers can now choose Postpaid billing during signup for eligible hourly and monthly services. The selected Prepaid or Postpaid mode remains for the life of the account. Postpaid requires a credit card saved through Stripe.',
    pubDate: '2026-09-01',
    slug: 'postpaid-billing',
  },
  {
    title: 'Intel compute in Montréal (YUL)',
    titleFr: 'Calcul Intel à Montréal (YUL)',
    description:
      'General-purpose ci2 and memory-optimized cim2 Intel plans, custom Intel configurations, and Intel-backed Kubernetes node capacity are now available in the YUL region.',
    pubDate: '2026-08-16',
    slug: 'intel-compute-yul',
  },
  {
    title: 'Platform and services updates',
    titleFr: 'Mises à jour de la plateforme et des services',
    description:
      'New capabilities and operational changes across the ZSoftly Cloud Platform, including SMTP controls, Kubernetes support, Windows Server images, and ZSoftly Cloud Storage.',
    pubDate: '2026-08-08',
    slug: 'platform-services',
  },
  {
    title: 'CLI v0.0.26: port forwarding and SSH key fixes',
    titleFr: 'CLI v0.0.26 : correctifs de redirection de ports et de clés SSH',
    description:
      'Port forwarding lists now show ports, asynchronous create commands report accepted requests, and SSH key deletion accepts IDs, names, and slugs.',
    pubDate: '2026-07-19',
    slug: 'cli-v0.0.26',
  },
  {
    title: 'CLI v0.0.25: DNS MX record support',
    titleFr: 'CLI v0.0.25 : prise en charge des enregistrements MX',
    description:
      'The zcp CLI now supports MX record priorities and validates priority flags before sending DNS record requests.',
    pubDate: '2026-07-18',
    slug: 'cli-v0.0.25',
  },
  {
    title: 'CLI v0.0.24: lifecycle and SDK improvements',
    titleFr: 'CLI v0.0.24 : améliorations du cycle de vie et du SDK',
    description:
      'VM and load balancer deletion workflows, public IP display, complete list pagination, and Apache 2.0 licensing for the CLI and SDK.',
    pubDate: '2026-07-16',
    slug: 'cli-v0.0.24',
  },
  {
    title: 'CLI v0.0.17: full object storage workflows',
    titleFr: 'CLI v0.0.17 : workflows complets de stockage objet',
    description:
      'The CLI adds object versioning, policies, tagging, encryption, lifecycle rules, CORS, presigned URLs, copy and move, and richer object operations.',
    pubDate: '2026-06-17',
    slug: 'cli-v0.0.17',
  },
  {
    title: 'Marketplace updates',
    titleFr: 'Mises à jour de la place de marché',
    description:
      'The ZCP Marketplace provides more than 20 one-click application images, including databases, web stacks, observability, automation, and security tools.',
    pubDate: '2026-06-17',
    slug: 'marketplace',
  },
  {
    title: 'Terraform and OpenTofu provider',
    titleFr: 'Fournisseur Terraform et OpenTofu',
    description:
      'Infrastructure as code support is being developed around the ZCP API and CLI resource model for repeatable, region-aware provisioning.',
    pubDate: '2026-06-10',
    slug: 'terraform-opentofu',
  },
];

/** Newest entries first. With lang 'fr', only entries that have a French title. */
export const latestChangelogEntries = (count: number, lang: 'en' | 'fr' = 'en') =>
  changelogFeedEntries
    .filter((entry) => lang === 'en' || entry.titleFr)
    .slice()
    .sort((a, b) => b.pubDate.localeCompare(a.pubDate))
    .slice(0, count)
    .map((entry) => ({
      ...entry,
      title: lang === 'fr' ? (entry.titleFr ?? entry.title) : entry.title,
    }));
