import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { changelogFeedEntries, publicationDateAtUtcNoon } from '../../data/changelog-feed';

export const GET: APIRoute = ({ site }) =>
  rss({
    title: 'ZSoftly Cloud Platform Changelog',
    description:
      'Platform and service features, Marketplace apps, the zcp CLI, and the Terraform / OpenTofu provider.',
    site: site ?? 'https://docs.zcp.zsoftly.ca',
    customData: '<language>en-ca</language>',
    trailingSlash: false,
    items: changelogFeedEntries.map((entry) => ({
      title: entry.title,
      description: entry.description,
      pubDate: publicationDateAtUtcNoon(entry.pubDate),
      link: `/changelog/#${entry.slug}`,
    })),
  });
