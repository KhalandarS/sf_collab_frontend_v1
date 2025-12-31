import MarkdownFileRender from "@/utils/markdownFileRender";

export default function WaitlistTerms() {
  return <>
    <div className="w-full min-h-screen px-4 md:px-8 lg:px-16 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MarkdownFileRender filePath="/docs/SF Programs Waitlist – Terms & Conditions.md" />
        </div>
      </div>
    </div>
  </>
}