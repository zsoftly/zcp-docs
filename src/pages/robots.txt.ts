import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Astro site URL was unavailable while rendering robots.txt.');
  const origin = site.origin;
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap-index.xml\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
