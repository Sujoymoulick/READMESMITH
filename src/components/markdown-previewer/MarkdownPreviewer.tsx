"use client";

import { useState } from "react";
import { Layout, Code2, Copy, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export function MarkdownPreviewer() {
  const [content, setContent] = useState<string>("# Welcome to the Live Previewer\n\nPaste your markdown here to see how it looks!");
  const [isCopied, setIsCopied] = useState(false);
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setIsCopied(true);
    toast.success("Markdown copied!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClear = () => {
    if (confirm("Clear all content?")) {
      setContent("");
      toast.info("Editor cleared");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 md:px-6 md:py-4 border-b border-border bg-card/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg shrink-0">
            <Layout className="h-5 w-5 text-amber-500" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-bold truncate">Live Previewer</h1>
            <p className="text-[10px] md:text-xs text-muted-foreground truncate">Edit and preview README in real-time</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex md:hidden bg-muted rounded-lg p-1">
            <Button 
              variant={activeView === "editor" ? "secondary" : "ghost"} 
              size="sm" 
              className="h-7 px-3 text-xs"
              onClick={() => setActiveView("editor")}
            >
              Editor
            </Button>
            <Button 
              variant={activeView === "preview" ? "secondary" : "ghost"} 
              size="sm" 
              className="h-7 px-3 text-xs"
              onClick={() => setActiveView("preview")}
            >
              Preview
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleClear} className="h-8 md:h-9 text-destructive hover:bg-destructive/10 px-2 md:px-3">
              <Trash2 className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Clear</span>
            </Button>
            <Button variant="default" size="sm" onClick={handleCopy} className="h-8 md:h-9 bg-amber-500 hover:bg-amber-600 text-black px-2 md:px-3">
              {isCopied ? <Check className="h-4 w-4 sm:mr-2" /> : <Copy className="h-4 w-4 sm:mr-2" />}
              <span className="hidden sm:inline">{isCopied ? "Copied" : "Copy"}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Editor Side */}
        <div className={cn(
          "w-full md:w-1/2 flex flex-col min-h-0 border-r border-border bg-card/5 transition-all duration-300",
          activeView === "preview" ? "hidden md:flex" : "flex"
        )}>
          <div className="p-3 border-b border-border bg-muted/30 flex items-center gap-2 shrink-0">
            <Code2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Markdown Editor</span>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full p-6 bg-transparent text-foreground/90 font-mono text-sm resize-none border-none outline-none focus:ring-0 leading-relaxed overflow-y-auto scrollbar-thin"
              placeholder="# Type or paste your markdown here..."
              spellCheck={false}
            />
          </div>
        </div>

        {/* Preview Side */}
        <div className={cn(
          "w-full md:w-1/2 flex flex-col min-h-0 bg-muted/5 transition-all duration-300",
          activeView === "editor" ? "hidden md:flex" : "flex"
        )}>
          <div className="p-3 border-b border-border bg-muted/30 flex items-center gap-2 shrink-0">
            <Layout className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Real-time Preview</span>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-8 prose prose-invert max-w-none">
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
                img: ({ node, ...props }: any) => (
                  <img {...props} className="rounded-lg border border-border/50 shadow-lg mx-auto" />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
