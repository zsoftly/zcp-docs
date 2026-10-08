/* global Node, document, URL, getComputedStyle */

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
  const escape = (value) => value.replace(/(\\|`|\*|_|\{|\}|<|>|\[|\])/g, '\\$&');
  const codeBlocks = [];
  const isSafeUrl = (value) => {
    try {
      return ['http:', 'https:', 'mailto:'].includes(new URL(value, baseUrl).protocol);
    } catch {
      return false;
    }
  };
  const absoluteUrl = (value) => new URL(value, baseUrl).href;
  const restoreCode = (value) =>
    value.replace(
      /@@CODE_(\d+)(?:_(INDENT)_(\d+)|(_QUOTE))?@@/g,
      (_, index, indent, spaces, quote) => {
        const continuation = quote ? '> ' : indent ? ' '.repeat(Number(spaces)) : '';
        return codeBlocks[Number(index)].replace(/\n/g, `\n${continuation}`);
      }
    );
  const markCodeIndent = (value, continuation) =>
    value.replace(
      /@@CODE_(\d+)@@/g,
      (_, index) => `@@CODE_${index}_INDENT_${continuation.length}@@`
    );
  const markQuotedCode = (value) =>
    value.replace(/@@CODE_(\d+)@@/g, (_, index) => `@@CODE_${index}_QUOTE@@`);
  const withDisplaySpacing = (element, rendered) => {
    const display = getComputedStyle(element).display;
    if (['block', 'flex', 'grid', 'list-item', 'table'].includes(display)) return `\n${rendered}\n`;
    if (['inline-block', 'inline-flex', 'inline-grid'].includes(display)) return ` ${rendered} `;
    return rendered;
  };
  const renderChildren = (element) => Array.from(element.childNodes).map(render).join('');
  const renderList = (element, ordered, indent = '') => {
    const start = Number(element.getAttribute('start') ?? 1);
    const items = Array.from(element.children).filter((child) => child.tagName === 'LI');
    const rendered = items.map((item, index) => {
      const marker = ordered
        ? `${Number(item.getAttribute('value') ?? Number.NaN) || start + index}.`
        : '-';
      const continuation = `${indent}${' '.repeat(marker.length + 1)}`;
      let body = '';
      for (const child of item.childNodes) {
        if (
          child.nodeType === Node.ELEMENT_NODE &&
          (child.tagName === 'OL' || child.tagName === 'UL')
        ) {
          body += renderList(child, child.tagName === 'OL', continuation);
        } else {
          body += render(child);
        }
      }
      const lines = clean(body).split('\n');
      const markdown = `${indent}${marker} ${lines
        .map((line, lineIndex) => {
          if (lineIndex === 0) return line;
          return line.startsWith(continuation) ? line : `${continuation}${line}`;
        })
        .join('\n')}`;
      return markCodeIndent(markdown, continuation);
    });
    return `\n${rendered.join('\n')}\n\n`;
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
        (row) => `| ${Array.from({ length: width }, (_, index) => row[index] ?? '').join(' | ')} |`
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
    ) {
      return '';
    }
    if (/^h[1-6]$/.test(tag))
      return `\n${'#'.repeat(Number(tag[1]))} ${clean(renderChildren(element))}\n\n`;
    if (tag === 'p') return `\n${clean(renderChildren(element))}\n\n`;
    if (tag === 'br') return '\n';
    if (tag === 'hr') return '\n---\n\n';
    if (tag === 'a') {
      const label = renderChildren(element);
      const href = element.getAttribute('href');
      if (!href || !label.trim() || !isSafeUrl(href)) return label;
      const leading = label.match(/^\s*/)?.[0] ?? '';
      const trailing = label.match(/\s*$/)?.[0] ?? '';
      return withDisplaySpacing(
        element,
        `${leading}[${label.trim()}](${absoluteUrl(href)})${trailing}`
      );
    }
    if (tag === 'img') {
      const source = element.getAttribute('src');
      return source && element.alt && isSafeUrl(source)
        ? `![${element.alt}](${absoluteUrl(source)})`
        : (element.alt ?? '');
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
    if (tag === 'blockquote') {
      const quote = clean(renderChildren(element));
      const quoted = markQuotedCode(quote)
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n');
      return `\n${quoted}\n\n`;
    }
    if (element.getAttribute('role') === 'tabpanel') {
      const label = document.getElementById(
        element.getAttribute('aria-labelledby') ?? ''
      )?.textContent;
      return `\n#### ${clean(label ?? 'Example')}\n\n${clean(renderChildren(element))}\n\n`;
    }
    return withDisplaySpacing(element, renderChildren(element));
  };

  const markdownWithTokens = clean(render(content))
    .split('\n')
    .map((line) => {
      const indentation = line.match(/^\s*/)?.[0] ?? '';
      return `${indentation}${line.slice(indentation.length).replace(/ {2,}/g, ' ')}`;
    })
    .join('\n');
  const markdown = restoreCode(markdownWithTokens);
  return {
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
    summary: clean(content.querySelector('p')?.textContent ?? ''),
    hasHeading: /^# /m.test(markdownWithTokens),
    markdown,
    title: document.title.replace(/\s*\|\s*(?:ZSoftly Docs|Documentation ZSoftly)$/, ''),
  };
};
