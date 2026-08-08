import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function mdxLinkTargetIndexIntegration(options) {
  return {
    name: 'zcp-mdx-link-target-index',
    hooks: {
      'astro:config:setup': ({ config, updateConfig }) => {
        updateConfig({
          markdown: {
            rehypePlugins: [
              ...(config.markdown.rehypePlugins ?? []),
              [rehypeMdxLinkTargetIndex, options],
            ],
          },
        });
      },
    },
  };
}

/**
 * Index MDX headings for starlight-links-validator on Astro 6.
 *
 * The validator attaches to Astro's Markdown processor. Astro's separate MDX
 * integration does not receive that processor, so MDX routes are missing from
 * the validator's destination map. This bridge indexes MDX headings only.
 */
export function rehypeMdxLinkTargetIndex(options) {
  const docsDirectory = fileURLToPath(options.docsDirectory);
  const base = options.base;

  return (tree, file) => {
    const filePath = file.history[0];
    if (!filePath || !filePath.endsWith('.mdx')) return;


    const headings = new Set(['_top']);
    collectHeadingIds(tree, headings);

    const id = toDocumentId(filePath, docsDirectory, base);
    const validationData = (globalThis._starlightLinksValidatorValidationData ??= new Map());

    validationData.set(id, {
      file: filePath,
      headings: [...headings],
      links: [],
    });
  };
}

function collectHeadingIds(node, headings) {
  if (!node || typeof node !== 'object') return;

  if (typeof node.properties?.id === 'string' && node.properties.id.length > 0) {
    headings.add(node.properties.id);
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) collectHeadingIds(child, headings);
  }
}

function toDocumentId(filePath, docsDirectory, base) {
  const relativePath = path
    .relative(docsDirectory, filePath)
    .replace(/\.[^.]+$/, '')
    .replace(/(^|[/\\])index$/, '')
    .replace(/[/\\]?$/, '/');

  const documentPath = relativePath
    .split(/[/\\]/)
    .filter(Boolean)
    .map(toSlug)
    .join('/');

  const route = documentPath ? `${documentPath}/` : '';
  return base === '/' ? route : path.posix.join(base.replace(/^\//, ''), route);
}

function toSlug(segment) {
  return segment
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
