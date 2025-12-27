import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
export default function MarkdownFileRender({ content, filePath }) {
  const [md, setMd] = useState(content || '');

  useEffect(() => {
    if (!filePath) return;
    fetch(filePath)
      .then(r => r.text())
      .then(setMd)
      .catch(console.error);
  }, [filePath]);

  return <ReactMarkdown>{md}</ReactMarkdown>;
}
