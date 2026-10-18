import { marked } from 'marked';

export function renderMarkdown(text) {
  const safe = (text || '').replace(/</g, '&lt;');
  return marked.parse(safe, { async: false, gfm: true, breaks: true });
}
