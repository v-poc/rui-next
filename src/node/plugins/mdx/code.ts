import path from 'upath';
import { visit } from 'unist-util-visit';
import { Parser } from 'acorn';
import jsx from 'acorn-jsx';
import type { Plugin } from 'unified';
import type { MdxJsxAttribute, MdxJsxFlowElement } from 'mdast-util-mdx-jsx';
import type { MdxjsEsm } from 'mdast-util-mdxjs-esm';
import type { Code } from 'mdast';
import { CODE_DEMO_MODULE_ID_PREFIX } from '../../common/constants.js';

const parser = Parser.extend(jsx());

const moduleIdToCodeMap: Record<string, string> = {};

function checkIsDemo(meta: string) {
  const demo = /(^|\s)(demo|demo=\{true\})($|\s)/.test(meta);
  const onlyDemo = /(^|\s)(onlyDemo|onlyDemo=\{true\})($|\s)/.test(meta);
  return { demo, onlyDemo };
}

function getCodeDemoId(currentSize: number) {
  return `__code_demo_${currentSize}`;
}

function getCodeDemoModuleId(filePath: string, codeDemoId: string) {
  return path.normalize(
    `${CODE_DEMO_MODULE_ID_PREFIX}${filePath}/${codeDemoId}.tsx`
  );
}

/**
 * Remark plugin to transform code to <Demo/>
 */
export const remarkMdxCodeDemo: Plugin = () => (tree: any, file) => {
  const imports: Omit<MdxjsEsm, 'value'>[] = [];

  visit(tree, 'code', (node: Code, index, parent) => {
    if (!node.meta) {
      return;
    }

    const { demo, onlyDemo } = checkIsDemo(node.meta);

    if (!demo && !onlyDemo) {
      return;
    }

    const filePath = path.normalize(file.path);
    const codeDemoId = getCodeDemoId(imports.length);
    const codeDemoModuleId = getCodeDemoModuleId(filePath, codeDemoId);

    if (!node.value.includes('export default')) {
      return file.fail('Demo must have the default export');
    }

    // store the code content for loading the component
    moduleIdToCodeMap[codeDemoModuleId] = node.value;

    // push `import __code_demo_0 from '/@pressify/code-demo/xxx'`
    imports.push({
      type: 'mdxjsEsm',
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ImportDeclaration',
              specifiers: [
                {
                  type: 'ImportDefaultSpecifier',
                  local: {
                    type: 'Identifier',
                    name: codeDemoId,
                  },
                },
              ],
              source: {
                type: 'Literal',
                value: codeDemoModuleId,
                raw: JSON.stringify(codeDemoModuleId),
              },
            },
          ],
        },
      },
    });

    // pass the original code content to the code prop for presentation
    const demoAttributes: MdxJsxAttribute[] = [
      {
        type: 'mdxJsxAttribute',
        name: 'code',
        value: node.value,
      },
    ];

    // pass the `language` prop
    if (node.lang) {
      demoAttributes.push({
        type: 'mdxJsxAttribute',
        name: 'language',
        value: node.lang,
      });
    }

    // pass the `onlyDemo` prop
    if (onlyDemo) {
      demoAttributes.push({
        type: 'mdxJsxAttribute',
        name: 'onlyDemo',
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Literal',
                  value: true,
                  raw: 'true',
                },
              },
            ],
          },
        },
      });
    }

    const demoNode: MdxJsxFlowElement = {
      type: 'mdxJsxFlowElement',
      name: 'Demo',
      attributes: demoAttributes,
      children: [
        {
          type: 'mdxJsxFlowElement',
          name: codeDemoId,
          attributes: [],
          children: [],
        },
      ],
    };

    parent.children[index!] = demoNode;

    // // normal code block
    // parser ??= Parser.extend(jsx());

    // const code = JSON.stringify(`${node.value}\n`);
    // // set the `block` to true to let the code component know that this is a code block.
    // // set language className
    // const codeProps = `block ${
    //   node.lang ? `className="language-${node.lang}"` : ''
    // }`;
    // const value = `<pre ${node.meta}><code ${codeProps}>{${code}}</code></pre>`;
    // const estree = parser.parse(value, { ecmaVersion: 'latest' });

    // parent.children[index!] = {
    //   type: 'mdxFlowExpression',
    //   value,
    //   data: { estree },
    // } as Literal;
  });

  // add imports
  tree.children.unshift(...imports);
};

/**
 * Remark plugin for parsing markdown code block metadata
 *
 * Based on https://github.com/remcohaszing/remark-mdx-code-meta
 */
export const remarkMdxCodeMeta: Plugin = () => (tree: any) => {
  visit(tree, 'code', (node: Code, index, parent) => {
    const code = JSON.stringify(`${node.value}\n`);
    const codeProps = [
      node.lang ? `className="language-${node.lang}"` : '',
      node.meta,
      'codeBlock',
    ]
      .filter(Boolean)
      .join(' ');

    const value = `<pre><code ${codeProps}>{${code}}</code></pre>`;
    const estree = parser.parse(value, { ecmaVersion: 'latest' });

    parent.children[index!] = {
      type: 'mdxFlowExpression',
      value,
      data: { estree },
    };
  });
};

export function loadCodeDemo(
  moduleId: string,
  transformDemo?: (code: string) => string
) {
  const code = moduleIdToCodeMap[moduleId];

  if (!code) {
    throw new Error(`Code content of ${moduleId} is empty`);
  }

  return transformDemo?.(code) || code;
}
