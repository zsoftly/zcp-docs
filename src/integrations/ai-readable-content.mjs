/* global URL */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { renderMarkdown } from './ai-readable-renderer.mjs';

const exportOrigin = 'http://export.invalid';
const contentTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const pagePath = (output, file) => {
  const directory = path.dirname(path.relative(output, file));
  return directory === '.' ? '/' : `/${directory}/`;
};

export const markdownFile = (output, route) => {
  const root = path.resolve(output);
  const relative = route === '/' ? 'index.md' : `${route.replace(/^\/+|\/+$/g, '')}.md`;
  const file = path.resolve(root, relative);
  if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
    throw new Error(`Markdown output path escapes the build directory: ${route}`);
  }
  return file;
};

const listHtml = async (directory) => {
  const files = await Promise.all(
    (await readdir(directory, { withFileTypes: true })).map(async (entry) => {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) return listHtml(file);
      return entry.name === 'index.html' ? [file] : [];
    })
  );
  return files.flat();
};

const hasNoindex = (html) =>
  /<meta\b(?=[^>]*\bname\s*=\s*["']robots["'])(?=[^>]*\bcontent\s*=\s*["'][^"']*\bnoindex\b)[^>]*>/i.test(
    html
  );

const isIncludedPage = (html) =>
  /<link\b(?=[^>]*\brel\s*=\s*["'][^"']*\balternate\b)(?=[^>]*\btype\s*=\s*["']text\/markdown["'])[^>]*>/i.test(
    html
  ) &&
  !/<meta\b[^>]*http-equiv\s*=\s*["']refresh["']/i.test(html) &&
  !hasNoindex(html);

export const outputFileForRequest = (output, requestUrl) => {
  let requested;
  try {
    requested = new URL(requestUrl);
  } catch {
    return undefined;
  }
  if (requested.origin !== exportOrigin) return undefined;
  const rawPath = requestUrl.slice(exportOrigin.length).split(/[?#]/, 1)[0];
  if (/(?:^|\/)(?:\.{1,2}|%2e(?:%2e)?)(?:\/|$)/i.test(rawPath)) return undefined;
  let pathname;
  try {
    pathname = decodeURIComponent(requested.pathname);
  } catch {
    return undefined;
  }
  if (!pathname.startsWith('/') || pathname.includes('\0')) return undefined;
  const root = path.resolve(output);
  const relative = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
  const file = path.resolve(root, `.${relative}`);
  return file === root || file.startsWith(`${root}${path.sep}`) ? file : undefined;
};

const extractMarkdown = async (page, route, canonicalUrl) => {
  await page.goto(new URL(route, exportOrigin).href);
  const content = page.locator('.sl-markdown-content');
  if ((await content.count()) !== 1) {
    throw new Error(`Expected one .sl-markdown-content element while exporting ${route}.`);
  }
  return content.evaluate(renderMarkdown, canonicalUrl);
};

const sectionFor = (route) => {
  if (route.startsWith('/public-cloud/getting-started/')) return 'Getting Started';
  if (route.startsWith('/public-cloud/api/') || route.startsWith('/public-cloud/cli/')) {
    return 'API and CLI Reference';
  }
  if (route.startsWith('/tutorials/')) return 'Integrations and Examples';
  if (route.startsWith('/troubleshooting/')) return 'Troubleshooting';
  if (route === '/changelog/' || route === '/community/') return 'Optional';
  return 'Services and Guides';
};

export default function aiReadableContent() {
  let site;
  return {
    name: 'zcp-ai-readable-content',
    hooks: {
      'astro:config:done': ({ config }) => {
        site = config.site.toString().replace(/\/$/, '');
      },
      'astro:build:done': async ({ dir }) => {
        const output = fileURLToPath(dir);
        if (!site) throw new Error('Astro site URL was unavailable while exporting Markdown.');
        const browser = await chromium.launch({ headless: true });
        try {
          const page = await browser.newPage({ javaScriptEnabled: false });
          await page.route('**/*', async (route) => {
            const file = outputFileForRequest(output, route.request().url());
            if (!file) return route.abort();
            try {
              await route.fulfill({
                body: await readFile(file),
                contentType: contentTypes[path.extname(file)] ?? 'application/octet-stream',
              });
            } catch {
              await route.abort();
            }
          });
          const pages = [];
          for (const file of await listHtml(output)) {
            const html = await readFile(file, 'utf8');
            const route = pagePath(output, file);
            if (!isIncludedPage(html)) continue;
            if (!html.includes('<main'))
              throw new Error(`Public page ${route} has no <main> element to export.`);
            if (!html.includes('sl-markdown-content')) {
              throw new Error(`Public page ${route} has no documentation content to export.`);
            }
            const extracted = await extractMarkdown(page, route, new URL(route, site).href);
            if (!extracted.hasHeading)
              extracted.markdown = `# ${extracted.title}\n\n${extracted.markdown}`;
            const markdownPath = markdownFile(output, route);
            await mkdir(path.dirname(markdownPath), { recursive: true });
            await writeFile(markdownPath, `${extracted.markdown}\n`);
            pages.push({ ...extracted, route });
          }
          const groups = new Map();
          for (const item of pages.filter((item) => !item.route.startsWith('/fr/'))) {
            const group = sectionFor(item.route);
            groups.set(group, [...(groups.get(group) ?? []), item]);
          }
          const sections = [
            'Getting Started',
            'API and CLI Reference',
            'Services and Guides',
            'Integrations and Examples',
            'Troubleshooting',
            'Optional',
          ]
            .flatMap((group) =>
              groups.has(group)
                ? [
                    `## ${group}`,
                    '',
                    ...groups
                      .get(group)
                      .map(
                        (item) =>
                          `- [${item.title.replaceAll('[', '\\[').replaceAll(']', '\\]')}](${site}${item.route.replace(/\/$/, '')}.md): ${(item.description || item.summary || `Documentation for ${item.title}.`).replace(/\s+/g, ' ').trim()}`
                      ),
                    '',
                  ]
                : []
            )
            .join('\n');
          await writeFile(
            path.join(output, 'llms.txt'),
            `# ZSoftly Cloud Platform Documentation\n\n> Documentation for ZSoftly Cloud Platform, covering public-cloud compute, networking, object storage, Kubernetes, DNS, private cloud, and managed cloud storage.\n\nUse these pages as the source of truth for ZCP workflows. API requests require a Bearer token from the ZCP portal. Project identifiers are account-specific. Follow each guide’s prerequisites and compatibility notes.\n\n${sections}\n- [Complete documentation export](${site}/llms-full.txt): Read all published, non-splash documentation in one Markdown file.\n`
          );
          await writeFile(
            path.join(output, 'llms-full.txt'),
            `# ZSoftly Cloud Platform Documentation\n\n> Complete export of published ZSoftly Cloud Platform documentation.\n\n${pages.map((item) => `## Source: [${item.title}](${site}${item.route})\n\n${item.markdown}`).join('\n\n---\n\n')}\n`
          );
        } finally {
          await browser.close();
        }
      },
    },
  };
}
