import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { chromium } from 'playwright';
import { markdownFile, outputFileForRequest } from './ai-readable-content.mjs';
import { renderMarkdown } from './ai-readable-renderer.mjs';

const browser = await chromium.launch({ headless: true });

test.after(async () => {
  await browser.close();
});

const render = async (body) => {
  const page = await browser.newPage({ javaScriptEnabled: false });
  try {
    await page.setContent(
      `<title>Example | Documentation ZSoftly</title><main><div class="sl-markdown-content">${body}</div></main>`
    );
    return await page
      .locator('.sl-markdown-content')
      .evaluate(renderMarkdown, 'https://docs.example.test/guides/example/');
  } finally {
    await page.close();
  }
};

test('renders nested lists, escaped table cells, and Expressive Code lines', async () => {
  const result = await render(
    '<h1>Example</h1><ol start="10"><li>Cloud<ul><li>Networking<ol><li>Private subnet</li></ol></li></ul></li></ol><table><tr><th>Shell</th><th>Notes</th></tr><tr><td>bash|zsh|fish</td><td>first<br>second</td></tr></table><pre data-language="bash"><code><span class="ec-line">if true; then</span><span class="ec-line">  echo ready</span><span class="ec-line">fi</span></code></pre>'
  );

  assert.equal(result.hasHeading, true);
  assert.match(result.markdown, /10\. Cloud\n {4}- Networking\n {6}1\. Private subnet/);
  assert.match(result.markdown, /\| bash\\\|zsh\\\|fish \| first<br>second \|/);
  assert.match(result.markdown, /```bash\nif true; then\n {2}echo ready\nfi\n```/);
});

test('keeps ordered list child order and indents multi-block content and code', async () => {
  const result = await render(
    '<ol start="2"><li><p>First paragraph.</p><ul><li>Nested item</li></ul><p>Later paragraph.</p><pre data-language="bash"><code><span class="ec-line">echo first</span><span class="ec-line"></span><span class="ec-line">  echo later&#32;&#32;</span></code></pre></li></ol><blockquote><p>Quoted text.</p><pre data-language="sh"><code>echo quoted</code></pre></blockquote>'
  );

  assert.match(
    result.markdown,
    /2\. First paragraph\.\n\n {3}- Nested item\n\n {3}Later paragraph\./
  );
  assert.match(result.markdown, / {3}```bash\n {3}echo first\n {3}\n {5}echo later {2}\n {3}```/);
  assert.match(result.markdown, /> Quoted text\.\n>\n> ```sh\n> echo quoted\n> ```/);
});

test('uses CSS display boundaries and preserves inline link whitespace from a routed page', async () => {
  const page = await browser.newPage({ javaScriptEnabled: false });
  try {
    await page.route('http://export.invalid/**', async (route) => {
      if (route.request().url().endsWith('.css')) {
        await route.fulfill({
          body: '.block { display: block; } .inline { display: inline-flex; }',
          contentType: 'text/css',
        });
      } else {
        await route.fulfill({
          body: '<title>Example | Documentation ZSoftly</title><link rel="stylesheet" href="/_astro/site.css"><main><div class="sl-markdown-content"><span class="block">team,</span><span class="block">without</span><p>See <a href="/docs"> the docs </a>now.</p><span class="inline">Announcements</span><span class="inline">October</span></div></main>',
          contentType: 'text/html',
        });
      }
    });
    await page.goto('http://export.invalid/example/');
    const result = await page
      .locator('.sl-markdown-content')
      .evaluate(renderMarkdown, 'https://docs.example.test/example/');
    assert.match(result.markdown, /team,\n\nwithout/);
    assert.match(result.markdown, /See \[the docs\]\(https:\/\/docs\.example\.test\/docs\) now\./);
    assert.match(result.markdown, /Announcements October/);
  } finally {
    await page.close();
  }
});

test('rejects unsafe URLs and does not mistake a code comment for a heading', async () => {
  const result = await render(
    '<p><a href="javascript:alert(1)">unsafe</a><img src="data:image/png;base64,abc" alt="image"><a href="mailto:support@example.test">email</a></p><pre data-language="bash"><code><span class="ec-line"># shell comment</span><span class="ec-line">echo ready</span></code></pre>'
  );

  assert.equal(result.hasHeading, false);
  assert.equal(result.title, 'Example');
  assert.match(result.markdown, /unsafeimage\[email\]\(mailto:support@example\.test\)/);
  assert.doesNotMatch(result.markdown, /javascript:|data:image/);
  assert.match(result.markdown, /```bash\n# shell comment\necho ready\n```/);
});

test('keeps Markdown output and routed files within the build directory', () => {
  const output = path.resolve('/tmp/docs-export');
  assert.equal(markdownFile(output, '/'), path.join(output, 'index.md'));
  assert.equal(markdownFile(output, '/legal/privacy/'), path.join(output, 'legal/privacy.md'));
  assert.throws(() => markdownFile(output, '/../../outside/'), /escapes the build directory/);
  assert.equal(
    outputFileForRequest(output, 'http://export.invalid/legal/privacy/'),
    path.join(output, 'legal/privacy/index.html')
  );
  assert.equal(outputFileForRequest(output, 'http://export.invalid/%2e%2e/secret'), undefined);
  assert.equal(outputFileForRequest(output, 'https://example.test/legal/privacy/'), undefined);
});
