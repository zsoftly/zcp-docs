/* global Node, URL, document, process */
/* eslint-disable no-useless-escape */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const pagePath = (output, file) => {
  const directory = path.dirname(path.relative(output, file));
  return directory === '.' ? '/' : `/${directory}/`;
};
const markdownFile = (output, route) =>
  path.join(output, route === '/' ? 'index.md' : `${route.replace(/\/$/, '')}.md`);
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

export const renderMarkdown = (content, baseUrl) => {
    const ignored = new Set([
      'button',
      'form',
      'input',
      'label',
      'option',
      'script',
      'select',
      'style',
      'svg',
      'textarea',
    ]);
    const clean = (value) =>
      value
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    const escape = (value) => value.replace(/[\\`*_{}<>\[\]]/g, '\\$&');
    const codeBlocks = [];
    const renderChildren = (element) => Array.from(element.childNodes).map(render).join('');
    const renderList = (element, ordered, indent = '') => {
      const items = Array.from(element.children).filter((child) => child.tagName === 'LI');
      const start = Number(element.getAttribute('start') ?? 1);
      return `\n${items
        .map((item, index) => {
        const content = clean(
          Array.from(item.childNodes)
            .filter(
              (child) =>
                child.nodeType !== Node.ELEMENT_NODE ||
                !['OL', 'UL'].includes(child.tagName)
            )
            .map(render)
            .join('')
        );
        const marker = ordered ? `${Number(item.getAttribute('value') ?? start + index)}.` : '-';
        const nested = Array.from(item.children)
          .filter((child) => child.tagName === 'OL' || child.tagName === 'UL')
          .map((child) =>
            renderList(child, child.tagName === 'OL', `${indent}${' '.repeat(marker.length + 1)}`)
          );
        const line = `${indent}${marker} ${content}`;
        const nestedContent = nested.join('').replace(/^\n|\n+$/g, '');
        return nestedContent ? `${line}\n${nestedContent}` : line;
      })
        .join('\n')}\n\n`;
    };
    const renderTable = (element) => {
      const rows = Array.from(element.querySelectorAll('tr')).map((row) =>
        Array.from(row.querySelectorAll(':scope > th, :scope > td')).map((cell) =>
          clean(renderChildren(cell)).replace(/\|/g, '\\|').replace(/\n/g, '<br>')
        )
      );
      if (!rows.length) return '';
      const width = Math.max(...rows.map((row) => row.length));
      const header = rows[0].map((value, index) => value || `Column ${index + 1}`);
      return `\n${[header, Array(width).fill('---'), ...rows.slice(1)]
        .map(
          (row) =>
          `| ${Array.from({ length: width }, (_, index) => row[index] ?? '').join(' | ')} |`
        )
        .join('\n')}\n\n`;
    };
    const render = (node) => {
      if (node.nodeType === Node.TEXT_NODE)
        return escape((node.textContent ?? '').replace(/\s+/g, ' '));
      if (node.nodeType !== Node.ELEMENT_NODE) return '';
      const element = node;
      const tag = element.tagName.toLowerCase();
      if (
        ignored.has(tag) ||
        element.getAttribute('aria-hidden') === 'true' ||
        element.getAttribute('role') === 'tablist' ||
        element.classList.contains('sl-anchor-link')
      )
        return '';
      if (/^h[1-6]$/.test(tag))
        return `\n${'#'.repeat(Number(tag[1]))} ${clean(renderChildren(element))}\n\n`;
      if (tag === 'p') return `\n${clean(renderChildren(element))}\n\n`;
      if (tag === 'br') return '\n';
      if (tag === 'hr') return '\n---\n\n';
      if (tag === 'a') {
        const label = clean(renderChildren(element));
        const href = element.getAttribute('href');
        return href && label ? `[${label}](${new URL(href, baseUrl).href})` : label;
      }
      if (tag === 'img') {
        const source = element.getAttribute('src');
        return source && element.alt ? `![${element.alt}](${new URL(source, baseUrl).href})` : '';
      }
      if (tag === 'pre') {
        const code = element.querySelector('code');
        const lines = Array.from((code ?? element).querySelectorAll(':scope > .ec-line'));
        const source = lines.length
          ? lines.map((line) => line.textContent ?? '').join('\n')
          : ((code ?? element).textContent ?? '');
        const language =
          code?.className.match(/language-([^\s]+)/)?.[1] ??
          element.getAttribute('data-language') ??
          '';
        const fence = '`'.repeat(
          Math.max(3, ...Array.from(source.matchAll(/`+/g), (match) => match[0].length + 1))
        );
        const token = `@@CODE_${codeBlocks.length}@@`;
        codeBlocks.push(`${fence}${language}\n${source}\n${fence}`);
        return `\n${token}\n\n`;
      }
      if (tag === 'code') return `\`${clean(element.textContent ?? '')}\``;
      if (tag === 'ul') return renderList(element, false);
      if (tag === 'ol') return renderList(element, true);
      if (tag === 'table') return renderTable(element);
      if (tag === 'blockquote')
        return `\n> ${clean(renderChildren(element)).replace(/\n/g, '\n> ')}\n\n`;
      if (element.getAttribute('role') === 'tabpanel') {
        const label = document.getElementById(
          element.getAttribute('aria-labelledby') ?? ''
        )?.textContent;
        return `\n#### ${clean(label ?? 'Example')}\n\n${clean(renderChildren(element))}\n\n`;
      }
      if (['article', 'div', 'header', 'section'].includes(tag))
        return `\n${renderChildren(element)}\n`;
      return renderChildren(element);
    };
    const markdownWithTokens = clean(render(content));
    const markdown = codeBlocks.reduce(
      (output, block, index) => output.replace(`@@CODE_${index}@@`, block),
      markdownWithTokens
    );
    return {
      description:
        document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
      summary: clean(content.querySelector('p')?.textContent ?? ''),
      hasHeading: /^# /m.test(markdownWithTokens),
      markdown,
      title: document.title.replace(/\s*\|\s*(?:ZSoftly Docs|Documentation ZSoftly)$/, ''),
    };
};

const extractMarkdown = async (page, file, canonicalUrl) => {
  await page.goto(`file://${file}`);
  const content = page.locator('.sl-markdown-content');
  if ((await content.count()) !== 1) {
    throw new Error(`Expected one .sl-markdown-content element while exporting ${file}.`);
  }
  return content.evaluate(renderMarkdown, canonicalUrl);
};

const sectionFor = (route) => {
  if (route.startsWith('/public-cloud/getting-started/')) return 'Getting Started';
  if (route.startsWith('/public-cloud/api/') || route.startsWith('/public-cloud/cli/'))
    return 'API and CLI Reference';
  if (route.startsWith('/tutorials/')) return 'Integrations and Examples';
  if (route.startsWith('/troubleshooting/')) return 'Troubleshooting';
  if (route === '/changelog/' || route === '/community/') return 'Optional';
  return 'Services and Guides';
};

export default function aiReadableContent() {
  return {
    name: 'zcp-ai-readable-content',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const output = fileURLToPath(dir);
        const site = (process.env.PUBLIC_SITE_URL ?? 'https://docs.zcp.zsoftly.ca').replace(
          /\/$/,
          ''
        );
        const browser = await chromium.launch({ headless: true });
        try {
          const page = await browser.newPage({ javaScriptEnabled: false });
          await page.route('**/*', (route) =>
            route.request().url().startsWith('file:') ? route.continue() : route.abort()
          );
          const pages = [];
          for (const file of await listHtml(output)) {
            const html = await readFile(file, 'utf8');
            const route = pagePath(output, file);
            const excluded =
              route === '/' ||
              route === '/fr/' ||
              html.includes('http-equiv="refresh"') ||
              html.includes('name="robots" content="noindex');
            if (excluded) continue;
            if (!html.includes('<main')) {
              throw new Error(`Public page ${route} has no <main> element to export.`);
            }
            if (!html.includes('sl-markdown-content')) {
              throw new Error(`Public page ${route} has no documentation content to export.`);
            }
            const extracted = await extractMarkdown(page, file, new URL(route, site).href);
            if (!extracted.hasHeading) {
              extracted.markdown = `# ${extracted.title}\n\n${extracted.markdown}`;
            }
            await mkdir(path.dirname(markdownFile(output, route)), { recursive: true });
            await writeFile(markdownFile(output, route), `${extracted.markdown}\n`);
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
                          `- [${item.title.replace(/[\[\]]/g, '\\$&')}](${site}${item.route.replace(/\/$/, '')}.md): ${(item.description || item.summary || `Documentation for ${item.title}.`).replace(/\s+/g, ' ').trim()}`
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
