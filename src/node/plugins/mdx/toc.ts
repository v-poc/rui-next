import type { Plugin } from 'unified';
import { visitChildren } from 'unist-util-visit-children';
import { toString } from 'mdast-util-to-string';
import { parse } from 'acorn';
import type { MdxjsEsm } from 'mdast-util-mdxjs-esm';
import Slugger from 'github-slugger';

interface TocItem {
  id: string;
  text: string;
  depth: number;
}

const slugger = new Slugger();

/**
 * Remark plugin to export toc
 */
export const remarkMdxToc: Plugin = () => (tree: any) => {
  slugger.reset();

  const toc: TocItem[] = [];

  visitChildren((node: any) => {
    // only handle h2 ~ h4
    if (node.type !== 'heading' || node.depth < 2 || node.depth > 4) {
      return;
    }

    const text = toString(node);

    // push item to toc
    toc.push({
      id: slugger.slug(text),
      text,
      depth: node.depth,
    });
  })(tree);

  if (!toc.length) {
    return;
  }

  // export toc in markdown
  const tocCode = `export const toc = ${JSON.stringify(toc, null, 2)};`;
  const estree = parse(tocCode, {
    ecmaVersion: 'latest',
    sourceType: 'module',
  }) as any;

  const tocNode: MdxjsEsm = {
    type: 'mdxjsEsm',
    value: tocCode,
    data: {
      estree,
    },
  };

  tree.children.push(tocNode);
};
