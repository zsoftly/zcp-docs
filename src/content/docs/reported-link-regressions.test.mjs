/* global URL */
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const docsRoot = path.dirname(fileURLToPath(import.meta.url));
const site = 'https://docs.example.test';
const files = [
  'public-cloud/projects/index.md',
  'fr/public-cloud/projects/index.md',
  'public-cloud/load-balancer/index.md',
  'fr/public-cloud/load-balancer/index.md',
  'public-cloud/compute/connect-rdp.md',
  'fr/public-cloud/compute/connect-rdp.md',
  'private-cloud/getting-started/accessing-cloudstack.md',
  'fr/private-cloud/getting-started/accessing-cloudstack.md',
  'troubleshooting/index.md',
  'fr/troubleshooting/index.md',
];

const internalLinks = (source) =>
  [...source.matchAll(/(?<!!)\[[^\]]+\]\((?<href>[^)\s]+)(?:\s+[^)]*)?\)/g)]
    .map((match) => match.groups.href)
    .filter((href) => href.startsWith('/') || href.startsWith('.'));

const assertRouteExists = (pathname) => {
  const route = pathname.replace(/^\/+|\/+$/g, '');
  const source = path.join(docsRoot, route);
  return Promise.any([
    access(`${source}.md`),
    access(`${source}.mdx`),
    access(path.join(source, 'index.md')),
    access(path.join(source, 'index.mdx')),
  ]);
};

test('reported internal links resolve from both slash forms', async () => {
  for (const file of files) {
    const source = await readFile(path.join(docsRoot, file), 'utf8');
    const route = `/${file.replace(/(?:^|\/)index\.md$/, '').replace(/\.md$/, '')}`;
    const links = internalLinks(source);

    assert.ok(links.length > 0, `${file} has no internal links to verify`);
    for (const link of links) {
      const slashless = new URL(link, `${site}${route}`).pathname;
      const trailingSlash = new URL(link, `${site}${route}/`).pathname;
      assert.equal(slashless, trailingSlash, `${file}: ${link}`);
      await assertRouteExists(slashless);
    }
  }
});
