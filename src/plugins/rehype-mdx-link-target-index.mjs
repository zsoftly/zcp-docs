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
 * Index MDX headings and links for starlight-links-validator on Astro 6.
 *
 * The validator attaches to Astro's Markdown processor. Astro's separate MDX
 * integration does not receive that processor, so MDX routes are missing from
 * the validator's destination map. This bridge supplies the same headings and
 * body-link data needed for MDX validation.
 */
export function rehypeMdxLinkTargetIndex(options) {
  const docsDirectory = fileURLToPath(options.docsDirectory);
  const base = options.base;

  return (tree, file) => {
    const filePath = file.history[0];
    if (!filePath || !filePath.endsWith('.mdx')) return;

    const headings = new Set(['_top']);
    collectHeadingIds(tree, headings);
    const links = [];
    collectLinks(tree, links);

    const id = toDocumentId(filePath, docsDirectory, base);
    const validationData = (globalThis._starlightLinksValidatorValidationData ??= new Map());

    validationData.set(id, {
      file: filePath,
      headings: [...headings],
      links,
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

function collectLinks(node, links) {
  if (!node || typeof node !== 'object') return;

  if (
    node.type === 'element' &&
    node.tagName === 'a' &&
    typeof node.properties?.href === 'string'
  ) {
    const className = node.properties.className;
    const isAnchorLink =
      (typeof className === 'string' && className.split(/\s+/).includes('sl-anchor-link')) ||
      (Array.isArray(className) && className.includes('sl-anchor-link'));

    if (!isAnchorLink) {
      links.push({ raw: normalizeLink(node.properties.href), reference: getBodyReference(node) });
    }
  }

  if (
    (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
    Array.isArray(node.attributes)
  ) {
    const href = node.attributes.find(
      (attribute) => attribute?.type === 'mdxJsxAttribute' && attribute.name === 'href'
    )?.value;

    if (typeof href === 'string') {
      links.push({ raw: normalizeLink(href), reference: getBodyReference(node) });
    }
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) collectLinks(child, links);
  }
}

function getBodyReference(node) {
  const start = node.position?.start;
  return {
    location: 'body',
    position: start
      ? { type: 'source', line: start.line, column: start.column }
      : { type: 'unavailable' },
  };
}

function normalizeLink(link) {
  const hashIndex = link.indexOf('#');
  let beforeHash = hashIndex === -1 ? link : link.slice(0, hashIndex);
  let hash = hashIndex === -1 ? undefined : link.slice(hashIndex + 1);

  try {
    beforeHash = decodeURI(beforeHash);
  } catch {
    // Keep the authored URL when it contains malformed escape sequences.
  }

  if (hash === undefined) return beforeHash;
  if (hash.length === 0) return `${beforeHash}#`;

  try {
    hash = decodeURIComponent(hash);
  } catch {
    // Keep the authored hash when it contains malformed escape sequences.
  }

  return `${beforeHash}#${hash}`;
}

function toDocumentId(filePath, docsDirectory, base) {
  const relativePath = path
    .relative(docsDirectory, filePath)
    .replace(/\.[^.]+$/, '')
    .replace(/(^|[/\\])index$/, '')
    .replace(/[/\\]?$/, '/');

  const documentPath = relativePath.split(/[/\\]/).filter(Boolean).map(toSlug).join('/');

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
