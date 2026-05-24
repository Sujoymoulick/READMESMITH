"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Download, Code, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { toast } from "sonner";

interface MarkdownPreviewProps {
  markdown: string;
}

export function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    toast.success("Copied to clipboard!");
  };

  const downloadFile = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("README.md downloaded!");
  };

  return (
    <Card className="h-full bg-zinc-900 border-zinc-800 overflow-hidden flex flex-col">
      <Tabs defaultValue="preview" className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
          <TabsList className="bg-zinc-800 border-zinc-700">
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="h-4 w-4" /> Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-2">
              <Code className="h-4 w-4" /> Code
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-zinc-400 hover:text-white">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={downloadFile} className="text-zinc-400 hover:text-white">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="preview" className="flex-1 overflow-auto min-h-0 p-6 prose prose-invert max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
            components={{
              td: ({ node, vAlign, ...props }: any) => (
                <td {...props} valign={vAlign} />
              ),
              th: ({ node, vAlign, ...props }: any) => (
                <th {...props} valign={vAlign} />
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </TabsContent>

        <TabsContent value="code" className="flex-1 overflow-auto min-h-0 p-0 m-0">
          <textarea
            className="w-full h-full bg-zinc-950 text-zinc-300 p-6 font-mono text-sm resize-none border-none outline-none focus:ring-0"
            readOnly
            value={markdown}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
