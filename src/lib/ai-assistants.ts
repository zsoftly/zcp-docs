/**
 * AI assistants a reader can open a docs question in, and the prompts sent to them.
 *
 * Each assistant takes a prefilled prompt in its URL: ChatGPT `?prompt=`, Claude `?q=`,
 * Cursor `cursor.com/link/prompt?text=`. Used by the table of contents ("Ask AI about this
 * page") and by the Ask Docs dialog, so the links and prompts are defined once.
 */

export type AssistantId = 'chatgpt' | 'claude' | 'cursor';

export interface Assistant {
  id: AssistantId;
  /** Product name, for example "ChatGPT". */
  name: string;
  /** i18n key for the button label, for example "Open in ChatGPT". */
  labelKey: string;
  url: (prompt: string) => string;
}

export const assistants: Assistant[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    labelKey: 'zs.toc.openChatgpt',
    url: (prompt) => `https://chatgpt.com/?prompt=${encodeURIComponent(prompt)}`,
  },
  {
    id: 'claude',
    name: 'Claude',
    labelKey: 'zs.toc.openClaude',
    url: (prompt) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
  },
  {
    id: 'cursor',
    name: 'Cursor',
    labelKey: 'zs.toc.openCursor',
    url: (prompt) => `https://cursor.com/link/prompt?text=${encodeURIComponent(prompt)}`,
  },
];

export const defaultAssistant: AssistantId = 'chatgpt';

export const isAssistantId = (value: unknown): value is AssistantId =>
  assistants.some((assistant) => assistant.id === value);

export const assistantUrl = (id: AssistantId, prompt: string) =>
  (assistants.find((assistant) => assistant.id === id) ?? assistants[0]).url(prompt);

/** Prompt that asks an assistant to read one page. */
export const pagePrompt = (pageMarkdownUrl: string) =>
  `Read this documentation page:\n\n${pageMarkdownUrl}`;

/**
 * Prompt for a reader's own question. It points the assistant at the page the reader is on,
 * the llms.txt index and the full documentation text, and asks it to answer from them. An empty
 * pageMarkdownUrl (the home page) leaves the page line out.
 */
export function questionPrompt(options: {
  question: string;
  pageMarkdownUrl: string;
  siteUrl: string;
  lang: 'en' | 'fr';
}): string {
  const site = options.siteUrl.replace(/\/$/, '');
  const question = options.question.trim();
  const page = options.pageMarkdownUrl;
  if (options.lang === 'fr') {
    return [
      'Réponds à ma question à partir de la documentation de ZSoftly Cloud Platform (ZCP).',
      '',
      ...(page ? [`Je lis cette page : ${page}`] : []),
      `Index de la documentation : ${site}/llms.txt`,
      `Texte complet de la documentation : ${site}/llms-full.txt`,
      '',
      'Appuie ta réponse sur cette documentation. Donne les liens des pages utilisées. Si la documentation ne couvre pas le sujet, dis-le. Réponds en français.',
      '',
      `Ma question : ${question}`,
    ].join('\n');
  }
  return [
    'Answer my question using the ZSoftly Cloud Platform (ZCP) documentation.',
    '',
    ...(page ? [`I am reading this page: ${page}`] : []),
    `Documentation index: ${site}/llms.txt`,
    `Full documentation text: ${site}/llms-full.txt`,
    '',
    'Base your answer on this documentation. Link the pages you used. If the documentation does not cover the topic, say so.',
    '',
    `My question: ${question}`,
  ].join('\n');
}
