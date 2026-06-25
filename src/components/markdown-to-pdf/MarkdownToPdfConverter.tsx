"use client";

import { useState } from "react";
import { Layout, Code2, Copy, Trash2, Check, Upload, FileDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export function MarkdownToPdfConverter() {
  const [content, setContent] = useState<string>(
    `# Markdown to PDF Converter\n\nPaste your markdown here, drag and drop a file, or select a file to import it.\n\n## Features\n- **Drag & Drop** support\n- **File Selection** browser\n- **Side-by-side** live preview\n- **Download as PDF** with optimized print layout\n\n## Example Markdown elements:\n- Lists (like this one)\n- Code snippets:\n  \`\`\`javascript\n  console.log("Hello, World!");\n  \`\`\`\n- Tables:\n  | Tool | Description | Status |\n  | :--- | :--- | :---: |\n  | ReadmeSmith | Awesome README builder | Active |\n  | PDF Converter | Convert markdown to PDF | Live |\n`
  );
  const [isCopied, setIsCopied] = useState(false);
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFile = (file: File) => {
    const isMarkdown = file.name.endsWith(".md") || file.name.endsWith(".markdown") || file.type === "text/markdown";
    const isText = file.name.endsWith(".txt") || file.type === "text/plain";
    
    if (isMarkdown || isText) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setContent(text);
          toast.success(`Loaded "${file.name}" successfully!`);
        }
      };
      reader.readAsText(file);
    } else {
      toast.error("Please drop a valid Markdown (.md) or text file.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleDownloadPDF = () => {
    const printContent = document.getElementById("pdf-preview-content");
    if (!printContent) {
      toast.error("Nothing to print");
      return;
    }

    toast.info("Preparing PDF for download...");

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) {
      toast.error("Failed to generate PDF");
      document.body.removeChild(iframe);
      return;
    }

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>README - Markdown Export</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              line-height: 1.6;
              color: #1d1d1f;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #111111;
              font-weight: 700;
              margin-top: 1.5em;
              margin-bottom: 0.5em;
              line-height: 1.25;
            }
            h1 { font-size: 2.25em; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3em; }
            h2 { font-size: 1.75em; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3em; }
            h3 { font-size: 1.4em; }
            h4 { font-size: 1.2em; }
            p { margin-top: 0; margin-bottom: 1em; color: #374151; }
            a { color: #2563eb; text-decoration: none; }
            a:hover { text-decoration: underline; }
            
            /* Lists */
            ul, ol {
              margin-top: 0;
              margin-bottom: 1em;
              padding-left: 2em;
              color: #374151;
            }
            li { margin-bottom: 0.25em; }
            
            /* Code */
            code {
              font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
              font-size: 0.9em;
              background-color: #f3f4f6;
              padding: 0.2em 0.4em;
              border-radius: 4px;
              color: #eb5757;
            }
            pre {
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              padding: 16px;
              border-radius: 8px;
              overflow-x: auto;
              margin-bottom: 1.5em;
            }
            pre code {
              background-color: transparent;
              padding: 0;
              border-radius: 0;
              color: #1e293b;
              font-size: 0.875em;
            }
            
            /* Blockquotes */
            blockquote {
              border-left: 4px solid #cbd5e1;
              padding: 0 1em;
              color: #475569;
              margin: 0 0 1.5em 0;
              font-style: italic;
            }
            
            /* Tables */
            table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 1.5em;
              font-size: 0.9em;
            }
            table th, table td {
              border: 1px solid #e2e8f0;
              padding: 10px 12px;
              text-align: left;
            }
            table th {
              background-color: #f8fafc;
              font-weight: 600;
              color: #1e293b;
            }
            table tr:nth-child(even) {
              background-color: #f8fafc;
            }
            
            /* Images */
            img {
              max-width: 100%;
              height: auto;
              border-radius: 6px;
              display: block;
              margin: 1.5em auto;
            }
            
            /* Horizontal Rule */
            hr {
              border: 0;
              height: 1px;
              background: #e2e8f0;
              margin: 2em 0;
            }
            
            /* Print settings */
            @media print {
              body {
                padding: 20px;
                background-color: #ffffff;
              }
              pre, blockquote, table, img {
                page-break-inside: avoid;
              }
              h1, h2, h3 {
                page-break-after: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="prose">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);
    iframeDoc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error("Print error:", err);
      } finally {
        document.body.removeChild(iframe);
      }
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 md:px-6 md:py-4 border-b border-border bg-card/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg shrink-0">
            <FileText className="h-5 w-5 text-amber-500" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-bold truncate">Markdown to PDF Converter</h1>
            <p className="text-[10px] md:text-xs text-muted-foreground truncate">Import Markdown files and download them as high-quality PDFs</p>
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
            <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="h-8 md:h-9 border-amber-500/30 text-amber-500 hover:bg-amber-500/10 px-2 md:px-3">
              <FileDown className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Download PDF</span>
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
        <div 
          className={cn(
            "w-full md:w-1/2 flex flex-col min-h-0 border-r border-border bg-card/5 transition-all duration-300 relative",
            activeView === "preview" ? "hidden md:flex" : "flex"
          )}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className="absolute inset-0 bg-background/90 backdrop-blur-sm border-2 border-dashed border-amber-500/50 m-2 rounded-xl flex flex-col items-center justify-center gap-4 z-50 animate-in fade-in zoom-in duration-200"
            >
              <div className="p-4 bg-amber-500/10 rounded-full text-amber-500">
                <Upload className="h-10 w-10 animate-bounce" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Drop Markdown file here</p>
                <p className="text-xs text-muted-foreground mt-1">Accepts .md, .markdown, .txt</p>
              </div>
            </div>
          )}

          <div className="p-3 border-b border-border bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Markdown Editor</span>
            </div>
            <div>
              <label 
                htmlFor="pdf-file-upload" 
                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground border border-border bg-transparent hover:bg-muted rounded-md cursor-pointer transition-colors shadow-sm"
              >
                <Upload className="h-3 w-3" />
                <span>Import File</span>
              </label>
              <input
                id="pdf-file-upload"
                type="file"
                accept=".md,.markdown,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full p-6 bg-transparent text-foreground/90 font-mono text-sm resize-none border-none outline-none focus:ring-0 leading-relaxed overflow-y-auto scrollbar-thin"
              placeholder="# Type, paste, or drop your markdown here..."
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
          <div id="pdf-preview-content" className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-8 prose prose-invert max-w-none">
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
