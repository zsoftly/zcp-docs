import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';
import { renderMarkdown } from './ai-readable-content.mjs';

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

test('does not mistake a shell comment in a code block for a document heading', async () => {
  const result = await render(
    '<pre data-language="bash"><code><span class="ec-line"># shell comment</span><span class="ec-line">echo ready</span></code></pre>'
  );

  assert.equal(result.hasHeading, false);
  assert.equal(result.title, 'Example');
  assert.match(result.markdown, /```bash\n# shell comment\necho ready\n```/);
});
