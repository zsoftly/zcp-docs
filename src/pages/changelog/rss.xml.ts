import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { changelogFeedEntries } from '../../data/changelog-feed';

export const GET: APIRoute = ({ site }) =>
  rss({
    title: 'ZSoftly Cloud Platform Changelog',
    description:
      'Platform and service features, Marketplace apps, the zcp CLI, and the Terraform / OpenTofu provider.',
    site: site ?? 'https://docs.zcp.zsoftly.ca',
    customData: '<language>en-ca</language>',
    items: changelogFeedEntries.map((entry) => ({
      title: entry.title,
      description: entry.description,
      pubDate: new Date(`${entry.pubDate}T12:00:00Z`),
      link: `/changelog/#${entry.slug}`,
    })),
  });
