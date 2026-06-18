import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

// Serve a plain-Markdown version of every docs page at `<page-path>.md`
// (e.g. /changelog/ -> /changelog.md). Used by the "Ask AI about this page"
// links so assistants ingest clean source instead of rendered HTML, and by the
// "Copy as Markdown" action. The Starlight entry `id` is the page's URL path
// (root locale has no prefix; French entries keep the `fr/` prefix), so it maps
// 1:1 to the rendered route.
export const getStaticPaths: GetStaticPaths = async () => {
  const docs = await getCollection('docs');
  return docs
    .filter((entry) => entry.id && entry.data.template !== 'splash') // splash pages are layout markup, not prose
    .map((entry) => ({
      params: { slug: entry.id },
      props: { title: entry.data.title, body: entry.body ?? '' },
    }));
};

// Reduce MDX source to plain Markdown so assistants don't ingest component
// noise. Only the Starlight component import is removed (NOT code-block imports
// like `import boto3`), and <Tabs>/<TabItem> are unwrapped — each tab becomes a
// labeled subsection so its code block survives.
function toPlainMarkdown(body: string): string {
  return body
    .replace(/^\s*import\s+\{[^}]*\}\s+from\s+['"]@astrojs\/starlight\/components['"];?\s*$/gm, '')
    .replace(/<TabItem\b[^>]*\blabel=["']([^"']+)["'][^>]*>/g, '\n#### $1\n')
    .replace(/<\/?TabItem\b[^>]*>/g, '')
    .replace(/<\/?Tabs\b[^>]*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export const GET: APIRoute = ({ props }) => {
  const { title, body } = props as { title: string; body: string };
  const md = toPlainMarkdown(body);
  // Prepend the page title as an H1 for context — unless the body already opens
  // with a heading of the same title (avoids a duplicate heading).
  const firstLine = md.split('\n', 1)[0]?.trim() ?? '';
  const escaped = title?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') ?? '';
  const opensWithTitle = escaped !== '' && new RegExp(`^#{1,6}\\s+${escaped}\\s*$`).test(firstLine);
  const markdown = title && !opensWithTitle ? `# ${title}\n\n${md}` : md;
  return new Response(markdown, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
