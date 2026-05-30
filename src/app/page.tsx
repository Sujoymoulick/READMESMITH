"use client";

import { useState } from "react";
import { useREADME } from "@/hooks/use-readme";
import { generateMarkdown } from "@/lib/markdown-generator";
import { SectionEditor } from "@/components/editor/section-editor";
import { MarkdownPreview } from "@/components/preview/markdown-preview";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Settings,
  Users,
  Sparkles,
  Eye,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContributorsPage } from "@/components/contributors/contributors-page";
import { PromptBuilder } from "@/components/prompt-builder/PromptBuilder";
import { MarkdownPreviewer } from "@/components/markdown-previewer/MarkdownPreviewer";
import SonicWaveformHero from "@/components/ui/sonic-waveform";

export default function Home() {
  const { data, updateSection, addSection, removeSection, setData } = useREADME();
  const [activeTab, setActiveTab] = useState<"editor" | "contributors" | "prompt-builder" | "previewer">("editor");
  const [hasStarted, setStarted] = useState(false);

  const markdown = generateMarkdown(data.sections);

  const addNewSection = (type: any) => {
    const id = `${type}-${Date.now()}`;
    let content = { text: "" };
    if (type === "streak") {
      content = { username: "" } as any;
    } else if (type === "gif") {
      content = { url: "", align: "center" } as any;
    } else if (type === "profile-details") {
      content = {
        intro: "Welcome to my GitHub profile! This repository serves as a digital portfolio showcasing my development skills and contributions.",
        points: [
          { title: "Learning & Development", text: "Repositories for educational purposes and skill building." },
          { title: "Software Development", text: "Projects demonstrating proficiency in modern technologies." }
        ],
        expect: "A history of my work and learning progression."
      } as any;
    }

    addSection({
      id,
      type,
      title: type === "profile-details" ? "About This Profile" : type.charAt(0).toUpperCase() + type.slice(1),
      enabled: true,
      content: content,
    });
    toast.success(`Added ${type} section`);
  };

  if (!hasStarted) {
    return <SonicWaveformHero onStart={() => setStarted(true)} />;
  }

  return (
    <main className="flex h-[100dvh] bg-background text-foreground overflow-hidden flex-col md:flex-row">
      {/* Sidebar/Navigation - Mobile Top / Desktop Left */}
      <div className="w-full md:w-16 border-b md:border-b-0 md:border-r border-border flex md:flex-col items-center py-4 md:py-6 px-4 md:px-0 justify-between md:justify-start gap-4 md:gap-6 bg-sidebar shrink-0">
        <div className="p-1 bg-card rounded-lg shrink-0 overflow-hidden border border-border">
          <img src="/mainlogo.png" alt="ReadmeSmith Logo" className="h-8 w-8 object-cover" />
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-col gap-4 justify-start">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab("editor")}
            className={activeTab === "editor" ? "bg-accent text-accent-foreground" : ""}
            title="Editor"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab("prompt-builder")}
            className={activeTab === "prompt-builder" ? "bg-accent text-accent-foreground" : ""}
            title="AI Prompt Builder"
          >
            <Sparkles className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab("contributors")}
            className={activeTab === "contributors" ? "bg-accent text-accent-foreground" : ""}
            title="Credits & Contributors"
          >
            <Users className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab("previewer")}
            className={activeTab === "previewer" ? "bg-accent text-accent-foreground" : ""}
            title="Live Markdown Previewer"
          >
            <Eye className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground">
              <DropdownMenuItem onClick={() => setActiveTab("editor")} className="gap-2">
                <Settings className="h-4 w-4" /> Editor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("prompt-builder")} className="gap-2">
                <Sparkles className="h-4 w-4" /> AI Prompt Builder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("contributors")} className="gap-2">
                <Users className="h-4 w-4" /> Contributors
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("previewer")} className="gap-2">
                <Eye className="h-4 w-4" /> Live Previewer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
        {activeTab === "contributors" ? (
          <ContributorsPage />
        ) : activeTab === "prompt-builder" ? (
          <PromptBuilder />
        ) : activeTab === "previewer" ? (
          <MarkdownPreviewer />
        ) : (
          <>
            <Tabs defaultValue="editor" className="flex-1 flex flex-col md:hidden min-h-0">
              <div className="px-4 py-2 border-b border-border bg-muted/30 flex justify-between items-center">
                <TabsList className="bg-muted border-border">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent className="bg-popover border-border text-popover-foreground">
                    <DropdownMenuItem onClick={() => addNewSection("banner")}>Banner Image</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNewSection("header")}>Title Header</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNewSection("intro")}>Introduction</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNewSection("profile-details")}>About This Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNewSection("about")}>About Section</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNewSection("skills")}>Skills</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNewSection("projects")}>Projects List</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNewSection("streak")}>GitHub Streak</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNewSection("socials")}>Social Links</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNewSection("gif")}>GIF / Image</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNewSection("footer")}>Footer & Credits</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <TabsContent value="editor" className="flex-1 m-0 min-h-0">
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/20">
                  <div className="p-4 space-y-4">
                    {data.sections.map((section) => (
                      <SectionEditor
                        key={section.id}
                        section={section}
                        onUpdate={(updates) => updateSection(section.id, updates)}
                        onRemove={() => removeSection(section.id)}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="preview" className="flex-1 m-0 min-h-0 p-4">
                <MarkdownPreview markdown={markdown} />
              </TabsContent>
            </Tabs>

            {/* Desktop Side-by-Side View */}
            <div className="hidden md:flex flex-1 min-h-0">
              {/* Editor Panel */}
              <div className="w-1/2 flex flex-col min-h-0 border-r border-border bg-background">
                <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                    ReadmeSmith
                  </h1>                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="outline" size="sm" className="gap-2">
                          <PlusCircle className="h-4 w-4" /> Add Section
                        </Button>
                      }
                    />
                    <DropdownMenuContent className="bg-popover border-border text-popover-foreground">
                      <DropdownMenuItem onClick={() => addNewSection("banner")}>
                        Banner Image
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addNewSection("header")}>
                        Title Header
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addNewSection("intro")}>
                        Introduction (Emoji list)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addNewSection("profile-details")}>
                        About This Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addNewSection("about")}>
                        About Section
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addNewSection("skills")}>
                        Skills / Tech Stack
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addNewSection("projects")}>
                        Projects List
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addNewSection("streak")}>
                        GitHub Streak
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addNewSection("socials")}>
                        Social Links
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addNewSection("gif")}>
                        GIF / Image
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addNewSection("footer")}>
                        Footer & Credits
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/20">
                  <div className="p-4 space-y-4 max-w-2xl mx-auto pb-40">
                    {data.sections.map((section) => (
                      <SectionEditor
                        key={section.id}
                        section={section}
                        onUpdate={(updates) => updateSection(section.id, updates)}
                        onRemove={() => removeSection(section.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview Panel */}
              <div className="w-1/2 bg-muted/20 p-4 min-h-0 overflow-hidden">
                <MarkdownPreview markdown={markdown} />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
