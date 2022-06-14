import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { MdxJsxAttribute, MdxJsxFlowElement } from 'mdast-util-mdx-jsx';

const calloutTypes = ['tip', 'info', 'warning', 'danger'];

function getDirectiveTitle(node: any) {
  const maybeLabel = node.children?.[0]?.value;

  if (
    node?.type === 'paragraph' &&
    node?.data?.directiveLabel &&
    typeof maybeLabel === 'string'
  ) {
    return maybeLabel;
  }
}

/**
 * Remark plugin to add callout component.
 *
 * @example
 * `:::tip[title]` -> `<Callout type="tip" title={title}>content</Callout>`
 */
export const remarkCallout: Plugin<[]> = () => tree => {
  visit(
    tree,
    (node: any) =>
      node.type === 'containerDirective' && calloutTypes.includes(node.name),
    (node: any, index, parent) => {
      const calloutType = node.name;
      const calloutTitle = getDirectiveTitle(node.children?.[0]);
      const calloutContent = calloutTitle
        ? node.children.slice(1)
        : node.children;

      const calloutAttributes = Object.keys(node.attributes || {})
        .map<MdxJsxAttribute>(name => ({
          type: 'mdxJsxAttribute',
          name,
          value: node.attributes[name],
        }))
        .concat({
          type: 'mdxJsxAttribute',
          name: 'type',
          value: calloutType,
        });

      if (calloutTitle) {
        calloutAttributes.push({
          type: 'mdxJsxAttribute',
          name: 'title',
          value: calloutTitle,
        });
      }

      // build <Callout> ast for mdx
      const calloutNode: MdxJsxFlowElement = {
        type: 'mdxJsxFlowElement',
        name: 'Callout',
        attributes: calloutAttributes,
        children: calloutContent,
      };

      // replace current node
      parent.children[index!] = calloutNode;
    }
  );
};
