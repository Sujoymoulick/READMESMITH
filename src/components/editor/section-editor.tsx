"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Section } from "@/types";
import { GripVertical, Trash2, PlusCircle, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillSelector } from "./skill-selector";

interface SectionEditorProps {
  section: Section;
  onUpdate: (updates: Partial<Section>) => void;
  onRemove: () => void;
}

const SOCIAL_PLATFORMS = [
  { name: "LinkedIn", slug: "linkedin", color: "0A66C2" },
  { name: "GitHub", slug: "github", color: "181717" },
  { name: "Twitter", slug: "twitter", color: "1DA1F2" },
  { name: "Facebook", slug: "facebook", color: "1877F2" },
  { name: "Instagram", slug: "instagram", color: "E4405F" },
  { name: "Fiverr", slug: "fiverr", color: "1DBF73" },
  { name: "Upwork", slug: "upwork", color: "6FDA44" },
  { name: "YouTube", slug: "youtube", color: "FF0000" },
  { name: "Discord", slug: "discord", color: "5865F2" },
];

export function SectionEditor({ section, onUpdate, onRemove }: SectionEditorProps) {
  const handleContentChange = (key: string, value: any) => {
    onUpdate({
      content: { ...section.content, [key]: value },
    });
  };

  const renderFields = () => {
    const c = section.content || {};

    switch (section.type) {
      case "banner":
        return (
          <div className="space-y-2">
            <Label>Banner Image URL</Label>
            <Input
              value={c.url || ""}
              onChange={(e) => handleContentChange("url", e.target.value)}
              placeholder="https://..."
            />
          </div>
        );
      case "header":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={c.title || ""}
                onChange={(e) => handleContentChange("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input
                value={c.subtitle || ""}
                onChange={(e) => handleContentChange("subtitle", e.target.value)}
              />
            </div>
          </div>
        );
      case "intro":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>🔭 Working on</Label>
              <Input value={c.workingOn || ""} onChange={(e) => handleContentChange("workingOn", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>🌱 Learning</Label>
              <Input value={c.learning || ""} onChange={(e) => handleContentChange("learning", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>💬 Ask me about</Label>
              <Input value={c.askMe || ""} onChange={(e) => handleContentChange("askMe", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>📫 Contact</Label>
              <Input value={c.contact || ""} onChange={(e) => handleContentChange("contact", e.target.value)} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>🖼️ Illustration URL (side-by-side)</Label>
              <Input value={c.illustrationUrl || ""} onChange={(e) => handleContentChange("illustrationUrl", e.target.value)} />
            </div>
          </div>
        );
      case "skills":
        return (
          <div className="space-y-4">
            <Label className="text-zinc-400">Select the skills you want to showcase</Label>
            <SkillSelector
              selectedSkills={c.skills || []}
              onChange={(skills) => handleContentChange("skills", skills)}
            />
          </div>
        );
      case "profile-details":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Intro Text</Label>
              <Textarea
                value={c.intro || ""}
                onChange={(e) => handleContentChange("intro", e.target.value)}
                placeholder="Welcome to my GitHub profile!..."
              />
            </div>
            {c.points?.map((p: any, i: number) => (
              <div key={i} className="p-3 bg-zinc-800/50 rounded-lg space-y-2 border border-zinc-700">
                <div className="flex justify-between items-center">
                  <Label className="text-zinc-300 font-bold text-xs uppercase">Point {i + 1}</Label>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-zinc-500 hover:text-red-400"
                    onClick={() => {
                      const newPoints = [...c.points];
                      newPoints.splice(i, 1);
                      handleContentChange("points", newPoints);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <Input
                  value={p.title || ""}
                  placeholder="Point Title"
                  className="bg-zinc-900 h-8 text-xs"
                  onChange={(e) => {
                    const newPoints = [...c.points];
                    newPoints[i].title = e.target.value;
                    handleContentChange("points", newPoints);
                  }}
                />
                <Textarea
                  value={p.text || ""}
                  placeholder="Point Description"
                  className="bg-zinc-900 min-h-[60px] text-xs"
                  onChange={(e) => {
                    const newPoints = [...c.points];
                    newPoints[i].text = e.target.value;
                    handleContentChange("points", newPoints);
                  }}
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                const newPoints = [...(c.points || []), { title: "", text: "" }];
                handleContentChange("points", newPoints);
              }}
            >
              <PlusCircle className="h-3 w-3 mr-2" /> Add Point
            </Button>
            <div className="space-y-2 border-t border-zinc-800 pt-4">
              <Label>What You Can Expect</Label>
              <Textarea
                value={c.expect || ""}
                onChange={(e) => handleContentChange("expect", e.target.value)}
                placeholder="A live history of my coding work..."
              />
            </div>
          </div>
        );
      case "streak":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>GitHub Username</Label>
              <Input
                value={c.username || ""}
                onChange={(e) => handleContentChange("username", e.target.value)}
                placeholder="yourusername"
              />
            </div>
            <div className="space-y-2">
              <Label>Theme</Label>
              <Input
                value={c.theme || "radical"}
                onChange={(e) => handleContentChange("theme", e.target.value)}
                placeholder="radical, dark, highcontrast, etc."
              />
            </div>
          </div>
        );
      case "gif":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>GIF / Image URL</Label>
              <Input
                value={c.url || ""}
                onChange={(e) => handleContentChange("url", e.target.value)}
                placeholder="https://.../animation.gif"
              />
            </div>
            <div className="space-y-2">
              <Label>Alignment</Label>
              <div className="flex gap-2">
                {["left", "center", "right"].map((align) => (
                  <Button
                    key={align}
                    variant={c.align === align || (!c.align && align === "center") ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-[10px] capitalize"
                    onClick={() => handleContentChange("align", align)}
                  >
                    {align}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Height (px)</Label>
              <Input
                type="number"
                value={c.height || ""}
                onChange={(e) => handleContentChange("height", e.target.value)}
                placeholder="e.g. 200"
                className="h-8"
              />
            </div>
          </div>
        );
      case "socials":
        const currentSocials = c.socials || [];
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-xs">Social Style</Label>
              <div className="flex gap-2">
                <Button
                  variant={c.style === "sustainable" || !c.style ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-[10px]"
                  onClick={() => handleContentChange("style", "sustainable")}
                >
                  Sustainable
                </Button>
                <Button
                  variant={c.style === "badges" ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-[10px]"
                  onClick={() => handleContentChange("style", "badges")}
                >
                  Badges
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SOCIAL_PLATFORMS.map((platform) => {
                const isAdded = currentSocials.some((s: any) => s.platform === platform.name);
                return (
                  <Button
                    key={platform.slug}
                    variant="outline"
                    size="sm"
                    disabled={isAdded}
                    className="text-[10px] h-8 gap-2 bg-zinc-900 border-zinc-800"
                    onClick={() => {
                      const newSocials = [...currentSocials, { platform: platform.name, url: "" }];
                      handleContentChange("socials", newSocials);
                    }}
                  >
                    <PlusCircle className="h-3 w-3" /> {platform.name}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                className="text-[10px] h-8 gap-2 bg-zinc-900 border-zinc-800"
                onClick={() => {
                  const newSocials = [...currentSocials, { platform: "Custom", url: "" }];
                  handleContentChange("socials", newSocials);
                }}
              >
                <LinkIcon className="h-3 w-3" /> Custom Link
              </Button>
            </div>

            <div className="space-y-3 pt-2">
              {currentSocials.map((social: any, i: number) => (
                <div key={i} className="flex gap-2 items-center group">
                  <div className="w-24 shrink-0">
                    <Input
                      value={social.platform}
                      className="h-8 text-[10px] bg-zinc-900 border-zinc-800"
                      onChange={(e) => {
                        const newSocials = [...currentSocials];
                        newSocials[i].platform = e.target.value;
                        handleContentChange("socials", newSocials);
                      }}
                    />
                  </div>
                  <Input
                    value={social.url}
                    placeholder="Profile URL"
                    className="h-8 text-[10px] bg-zinc-900 border-zinc-800"
                    onChange={(e) => {
                      const newSocials = [...currentSocials];
                      newSocials[i].url = e.target.value;
                      handleContentChange("socials", newSocials);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-500 hover:text-red-400 shrink-0"
                    onClick={() => {
                      const newSocials = [...currentSocials];
                      newSocials.splice(i, 1);
                      handleContentChange("socials", newSocials);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );
      case "about":
        return (
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              className="min-h-[100px]"
              value={c.text || ""}
              onChange={(e) => handleContentChange("text", e.target.value)}
            />
          </div>
        );
      default:
        return (
          <div className="py-2 text-sm text-zinc-500 italic">
            Configuration for {section.type} section.
          </div>
        );
    }
  };

  return (
    <Card className="p-4 bg-zinc-900 border-zinc-800">
      <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-zinc-600 cursor-grab" />
          <span className="font-semibold text-zinc-200">{section.title}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-zinc-400">Enabled</Label>
            <Switch
              checked={section.enabled}
              onCheckedChange={(checked) => onUpdate({ enabled: checked })}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-zinc-500 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className={section.enabled ? "" : "opacity-50 pointer-events-none"}>
        {renderFields()}
      </div>
    </Card>
  );
}
