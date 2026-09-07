export type ChangelogFeedEntry = {
  title: string;
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
    title: 'Terraform / OpenTofu provider v0.2.0',
    description:
      'The provider adds object storage bucket configuration resources, VPC and multi-network instances, and volume lookups. It also fixes volume-backup reads, VM-backup destruction, interval validation, and volume-list pagination.',
    pubDate: '2026-09-07',
    slug: 'terraform-v0.2.0',
  },
  {
    title: 'CLI v0.0.29: complete volume listings',
    description:
      'The zcp CLI and SDK now retrieve every page in volume listings and return explicit pagination errors. When a VPC reaches its subnet limit, the CLI directs you to request a quota increase before retrying.',
    pubDate: '2026-09-07',
    slug: 'cli-v0.0.29',
  },
  {
    title: 'Up to 8 subnets per VPC',
    description:
      'Each VPC supports up to 8 subnets, up from 3. Existing VPCs get the new limit with no changes. Raise a support ticket if a workload needs more.',
    pubDate: '2026-09-07',
    slug: 'vpc-subnet-limit',
  },
  {
    title: 'CLI v0.0.28: security fixes and working backups',
    description:
      'The zcp CLI redacts credentials from --debug output. It fixes the backup and vm-backup commands and makes instance ssh prefer the public IP.',
    pubDate: '2026-09-07',
    slug: 'cli-v0.0.28',
  },
  {
    title: 'Object storage endpoint DNS resolution from VPCs',
    description:
      'Fixed DNS configuration for newly created VPCs. Workloads in these VPCs now resolve the object storage endpoint.',
    pubDate: '2026-09-06',
    slug: 'object-storage-vpc-dns-resolution',
  },
  {
    title: 'Kubernetes 1.37 is available',
    description:
      'Kubernetes 1.37 is now available for new managed clusters, along with refreshed patch releases for the 1.34, 1.35, and 1.36 lines. The default version for new clusters is 1.36.4.',
    pubDate: '2026-09-06',
    slug: 'kubernetes-1.37',
  },
  {
    title: 'Postpaid billing is available',
    description:
      'Customers can now choose Postpaid billing during signup for eligible hourly and monthly services. The selected Prepaid or Postpaid mode remains for the life of the account. Postpaid requires a credit card saved through Stripe.',
    pubDate: '2026-09-01',
    slug: 'postpaid-billing',
  },
  {
    title: 'Intel compute in Montréal (YUL)',
    description:
      'General-purpose ci2 and memory-optimized cim2 Intel plans, custom Intel configurations, and Intel-backed Kubernetes node capacity are now available in the YUL region.',
    pubDate: '2026-08-16',
    slug: 'intel-compute-yul',
  },
  {
    title: 'Platform and services updates',
    description:
      'New capabilities and operational changes across the ZSoftly Cloud Platform, including SMTP controls, Kubernetes support, Windows Server images, and ZSoftly Cloud Storage.',
    pubDate: '2026-08-08',
    slug: 'platform-services',
  },
  {
    title: 'CLI v0.0.26: port forwarding and SSH key fixes',
    description:
      'Port forwarding lists now show ports, asynchronous create commands report accepted requests, and SSH key deletion accepts IDs, names, and slugs.',
    pubDate: '2026-07-19',
    slug: 'cli-v0.0.26',
  },
  {
    title: 'CLI v0.0.25: DNS MX record support',
    description:
      'The zcp CLI now supports MX record priorities and validates priority flags before sending DNS record requests.',
    pubDate: '2026-07-18',
    slug: 'cli-v0.0.25',
  },
  {
    title: 'CLI v0.0.24: lifecycle and SDK improvements',
    description:
      'VM and load balancer deletion workflows, public IP display, complete list pagination, and Apache 2.0 licensing for the CLI and SDK.',
    pubDate: '2026-07-16',
    slug: 'cli-v0.0.24',
  },
  {
    title: 'CLI v0.0.17: full object storage workflows',
    description:
      'The CLI adds object versioning, policies, tagging, encryption, lifecycle rules, CORS, presigned URLs, copy and move, and richer object operations.',
    pubDate: '2026-06-17',
    slug: 'cli-v0.0.17',
  },
  {
    title: 'Marketplace updates',
    description:
      'The ZCP Marketplace provides more than 20 one-click application images, including databases, web stacks, observability, automation, and security tools.',
    pubDate: '2026-06-17',
    slug: 'marketplace',
  },
  {
    title: 'Terraform and OpenTofu provider',
    description:
      'Infrastructure as code support is being developed around the ZCP API and CLI resource model for repeatable, region-aware provisioning.',
    pubDate: '2026-06-10',
    slug: 'terraform-opentofu',
  },
];
