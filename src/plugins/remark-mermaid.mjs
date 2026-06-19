// Rewrites ```mermaid code fences into a <pre class="mermaid"> element at the
// remark (mdast) stage, before Expressive Code's rehype pass runs. Because the
// resulting node is no longer a <pre><code> code block, Expressive Code leaves
// it alone; rehype-mermaid then finds <pre class="mermaid"> and renders it to
// static inline SVG at build time.
//
// The mdast-util-to-hast overrides (hName/hProperties/hChildren) produce a real
// hast element (not a raw HTML string), so no rehype-raw step is required.
export default function remarkMermaid() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'code' && node.lang === 'mermaid') {
        node.data = {
          hName: 'pre',
          hProperties: { className: ['mermaid'] },
          hChildren: [{ type: 'text', value: node.value }],
        };
      }
      if (Array.isArray(node.children)) {
        for (const child of node.children) visit(child);
      }
    };
    visit(tree);
  };
}
