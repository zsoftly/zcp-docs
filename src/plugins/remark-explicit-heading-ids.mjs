// Applies an explicit ID declared in a trailing comment to a Markdown heading.
// Markdown files use an HTML comment, while MDX files use an MDX comment.
// The heading remains an mdast heading, so Starlight collects it for page
// navigation and the table of contents.
const htmlExplicitIdComment = /^<!--\s*changelog-id:\s*([a-z][a-z0-9.-]*)\s*-->$/;
const mdxExplicitIdComment = /^\/\*\s*changelog-id:\s*([a-z][a-z0-9.-]*)\s*\*\/$/;

function explicitId(child) {
  if (child.type === 'html') return child.value.match(htmlExplicitIdComment)?.[1];
  if (child.type === 'mdxTextExpression') return child.value.match(mdxExplicitIdComment)?.[1];
}

export default function remarkExplicitHeadingIds() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'heading' && Array.isArray(node.children)) {
        const explicitIdNode = node.children.find((child) => explicitId(child));

        if (explicitIdNode) {
          const id = explicitId(explicitIdNode);
          node.children = node.children.filter((child) => child !== explicitIdNode);
          node.data = {
            ...node.data,
            hProperties: { ...node.data?.hProperties, id },
          };
        }
      }

      if (Array.isArray(node.children)) {
        for (const child of node.children) visit(child);
      }
    };

    visit(tree);
  };
}
