import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownFileRender({ content, filePath }) {
  const [md, setMd] = useState(content || '');

  useEffect(() => {
    if (!filePath) return;
    fetch(filePath)
      .then(r => r.text())
      .then(setMd)
      .catch(console.error);
  }, [filePath]);

  return (
    <div className="markdown-body">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      code({ node, inline, className, children, ...props }) {
        return (
          <code
            className={`bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono ${
              inline ? "" : "block overflow-x-auto my-2 p-4"
            }`}
            {...props}
          >
            {children}
          </code>
        );
      },
      a({ href, children }) {
        return (
          <a href={href} className="text-blue-600 hover:underline dark:text-blue-400">
            {children}
          </a>
        );
      },
      blockquote({ children }) {
        return (
          <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 my-4">
            {children}
          </blockquote>
        );
      },
    }}
  >
    {md}
  </ReactMarkdown>
</div>

  );
}
