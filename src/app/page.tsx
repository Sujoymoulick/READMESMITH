"use client";

import { useState } from "react";
import { useREADME } from "@/hooks/use-readme";
import { generateMarkdown } from "@/lib/markdown-generator";
import { SectionEditor } from "@/components/editor/section-editor";
import { MarkdownPreview } from "@/components/preview/markdown-preview";
import { SnakeGame } from "@/components/snake/snake-game";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PlusCircle,
  Download,
  Upload,
  Gamepad2,
  FileText,
  Settings,
  Users,
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
import SonicWaveformHero from "@/components/ui/sonic-waveform";

export default function Home() {
  const { data, updateSection, addSection, removeSection, setData } = useREADME();
  const [activeTab, setActiveTab] = useState<"editor" | "snake" | "contributors">("editor");
  const [hasStarted, setStarted] = useState(false);

  const markdown = generateMarkdown(data.sections);

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "readme-config.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Configuration exported!");
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setData(parsed);
        toast.success("Configuration imported!");
      } catch (err) {
        toast.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const addNewSection = (type: any) => {
    const id = `${type}-${Date.now()}`;
    let content = { text: "" };
    if (type === "streak" || type === "snake") {
      content = { username: "" } as any;
    } else if (type === "gif") {
      content = { url: "", align: "center" } as any;
    } else if (type === "profile-details") {
      content = {
        intro: "Welcome to my GitHub profile! This repository serves as a digital portfolio showcasing my development skills, coding journey, and open-source contributions.",
        points: [
          { title: "Learning & Skill Development", text: "Repositories for educational purposes. Solutions to coding challenges. Implementations of algorithms and data structures." },
          { title: "Web & Software Development", text: "Projects demonstrating proficiency in programming languages, frameworks, and technologies. Practical applications built for learning and showcasing development skills." }
        ],
        expect: "A live history of my coding work. Insight into my learning progression. Open-source engagement and collaboration opportunities."
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
    <main className="flex h-screen bg-zinc-950 text-white overflow-hidden flex-col md:flex-row">
      {/* Sidebar/Navigation - Mobile Top / Desktop Left */}
      <div className="w-full md:w-16 border-b md:border-b-0 md:border-r border-zinc-800 flex md:flex-col items-center py-4 md:py-6 px-4 md:px-0 gap-4 md:gap-6 bg-zinc-900/50">
        <div className="p-1 bg-zinc-800 rounded-lg shrink-0 overflow-hidden border border-zinc-700">
          <img src="/mainlogo.png" alt="ReadmeSmith Logo" className="h-8 w-8 object-cover" />
        </div>
        <div className="flex-1 flex md:flex-col gap-2 md:gap-4 justify-center md:justify-start">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab("editor")}
            className={activeTab === "editor" ? "bg-zinc-800" : ""}
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab("snake")}
            className={activeTab === "snake" ? "bg-zinc-800" : ""}
          >
            <Gamepad2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab("contributors")}
            className={activeTab === "contributors" ? "bg-zinc-800" : ""}
          >
            <Users className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex md:flex-col gap-2">
          <Button variant="ghost" size="icon" onClick={handleExportJSON}>
            <Download className="h-5 w-5" />
          </Button>
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".json"
              onChange={handleImportJSON}
            />
            <div className="p-2 hover:bg-zinc-800 rounded-md transition-colors">
              <Upload className="h-5 w-5" />
            </div>
          </label>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
        {activeTab === "snake" ? (
          <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-zinc-950">
            <div className="max-w-xl w-full">
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">Interactive Snake</h2>
              <SnakeGame />
            </div>
          </div>
        ) : activeTab === "contributors" ? (
          <ContributorsPage />
        ) : (
          <>
            <Tabs defaultValue="editor" className="flex-1 flex flex-col md:hidden min-h-0">
              <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/30 flex justify-between items-center">
                <TabsList className="bg-zinc-900 border-zinc-800">
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
                  <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-white">
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
                    <DropdownMenuItem onClick={() => addNewSection("snake")}>GitHub Snake</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addNewSection("footer")}>Footer & Credits</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <TabsContent value="editor" className="flex-1 m-0 min-h-0">
                <ScrollArea className="h-full">
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
                </ScrollArea>
              </TabsContent>
              <TabsContent value="preview" className="flex-1 m-0 min-h-0 p-4">
                <MarkdownPreview markdown={markdown} />
              </TabsContent>
            </Tabs>

            {/* Desktop Side-by-Side View */}
            <div className="hidden md:flex flex-1 min-h-0">
              {/* Editor Panel */}
              <div className="w-1/2 flex flex-col min-h-0 border-r border-zinc-800 bg-zinc-950">
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    ReadmeSmith
                  </h1>                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="outline" size="sm" className="gap-2">
                          <PlusCircle className="h-4 w-4" /> Add Section
                        </Button>
                      }
                    />
                    <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-white">
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
                      <DropdownMenuItem onClick={() => addNewSection("snake")}>
                        GitHub Snake
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addNewSection("footer")}>
                        Footer & Credits
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <ScrollArea className="flex-1 h-full">
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
                </ScrollArea>
              </div>

              {/* Preview Panel */}
              <div className="w-1/2 bg-zinc-900/20 p-4 min-h-0 overflow-hidden">
                <MarkdownPreview markdown={markdown} />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
