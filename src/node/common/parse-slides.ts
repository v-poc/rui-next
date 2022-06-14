import { Slide } from './types.js';

const cache = new Map<string, Slide[]>();

export function parseSlides(markdown: string): Slide[] {
  if (cache.has(markdown)) {
    return cache.get(markdown)!;
  }

  const lines = markdown.split(/\r?\n/g);
  const slides: Slide[] = [];

  let start = 0;

  function slice(end: number) {
    if (start === end) {
      return;
    }

    const content = lines.slice(start, end).join('\n');
    slides.push({
      content,
    });
    start = end + 1;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimRight();

    if (line.match(/^---+/)) {
      slice(i);

      const next = lines[i + 1];
      // found frontmatter, skip next dash
      if (line.match(/^---([^-].*)?$/) && !next?.match(/^\s*$/)) {
        start = i;
        for (i += 1; i < lines.length; i++) {
          if (lines[i].trimRight().match(/^---$/)) {
            break;
          }
        }
      }
    }

    // skip code block
    else if (line.startsWith('```')) {
      for (i += 1; i < lines.length; i++) {
        if (lines[i].startsWith('```')) {
          break;
        }
      }
    }
  }

  if (start <= lines.length - 1) {
    slice(lines.length);
  }

  cache.set(markdown, slides);

  return slides;
}
