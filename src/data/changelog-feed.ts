export type ChangelogFeedEntry = {
  title: string;
  description: string;
  pubDate: string;
  slug: string;
};

export const changelogFeedEntries: ChangelogFeedEntry[] = [
  {
    title: 'Oracle Linux 10 operating system template',
    description:
      'Oracle Linux 10 is now available as an operating system template in the YOW-1 and YUL-1 regions. It is separate from Marketplace applications.',
    pubDate: '2026-08-20',
    slug: 'oracle-linux-10',
  },
  {
    title: 'Debian 12 and 13 public images',
    description:
      'Debian 12 and Debian 13 are now available as public operating system images in the YOW-1 and YUL-1 regions.',
    pubDate: '2026-08-19',
    slug: 'debian-12-13',
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
    title: 'Marketplace catalog: 64 live images',
    description:
      'The ZCP Marketplace catalog now lists 64 live application images across databases, web stacks, observability, automation, and security.',
    pubDate: '2026-07-09',
    slug: 'marketplace',
  },
  {
    title: 'CLI v0.0.17: full object storage workflows',
    description:
      'The CLI adds object versioning, policies, tagging, encryption, lifecycle rules, CORS, presigned URLs, copy and move, and richer object operations.',
    pubDate: '2026-06-17',
    slug: 'cli-v0.0.17',
  },
  {
    title: 'Terraform and OpenTofu provider',
    description:
      'Infrastructure as code support is being developed around the ZCP API and CLI resource model for repeatable, region-aware provisioning.',
    pubDate: '2026-06-10',
    slug: 'terraform-opentofu',
  },
];
