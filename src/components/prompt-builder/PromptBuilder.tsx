"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Download,
  ExternalLink,
  MessageSquare,
  Check
} from "lucide-react";
import { promptSchema, type PromptBuilderData } from "@/types/prompt-builder";
import { generateReadmePrompt } from "@/lib/generatePrompt";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { SkillSelector } from "@/components/editor/skill-selector";

const STEPS = [
  "Basic Info",
  "Social Links",
  "About Me",
  "Focus Areas",
  "Tech Stack",
  "Projects",
  "Open Source",
  "Learning & Goals",
  "Style & Sections"
];

const FOCUS_OPTIONS = [
  "Artificial Intelligence", "Machine Learning", "Full Stack Development", 
  "Frontend Development", "Backend Development", "Blockchain", "Web3", 
  "Open Source", "Browser Extensions", "Cybersecurity", "DevOps", 
  "Data Science", "Mobile Development", "Cloud Computing", "UI/UX Design", 
  "Game Development", "SaaS Development"
];

const SECTION_OPTIONS = [
  "About Me", "Focus Areas", "Tech Stack", "Featured Projects", 
  "Open Source Projects", "GitHub Stats", "GitHub Streak", 
  "Snake Animation", "Visitor Counter", "Typing Banner", 
  "Learning Section", "Goals Section", "Contact Section"
];

const STYLE_OPTIONS = [
  "Professional", "Modern", "Minimal", "Futuristic", 
  "Creative", "Portfolio Style", "Open Source Maintainer Style"
];

export function PromptBuilder() {
  const [step, setStep] = useState(0);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const form = useForm<PromptBuilderData>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      fullName: "",
      role: "",
      tagline: "",
      bio: "",
      location: "",
      portfolioWebsite: "",
      socials: {
        github: "",
        linkedin: "",
        twitter: "",
        youtube: "",
        portfolio: "",
        devto: "",
        hashnode: "",
      },
      aboutMeLong: "",
      focusAreas: [],
      techStack: [],
      projects: [],
      showOpenSource: false,
      openSourceProjects: [],
      learning: [],
      goals: [],
      quote: "",
      style: "Professional",
      sectionsToInclude: ["About Me", "Tech Stack", "Featured Projects"],
    },
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  const { fields: osFields, append: appendOS, remove: removeOS } = useFieldArray({
    control: form.control,
    name: "openSourceProjects",
  });

  // Auto-save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("readmesmith-prompt-data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        form.reset(parsed);
      } catch (e) {
        console.error("Failed to restore prompt data", e);
      }
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem("readmesmith-prompt-data", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = (data: PromptBuilderData) => {
    try {
      const prompt = generateReadmePrompt(data);
      setGeneratedPrompt(prompt);
      setStep(STEPS.length); // Move to preview step
      toast.success("AI Prompt generated!");
    } catch (error) {
      console.error("Prompt generation failed:", error);
      toast.error("Failed to generate prompt. Please check your inputs.");
    }
  };

  const onInvalid = (errors: any) => {
    console.error("Form validation errors:", errors);
    
    const getErrorMessage = (obj: any): string | null => {
      if (!obj || typeof obj !== 'object') return null;
      if (obj.message) return obj.message;
      for (const key in obj) {
        const msg = getErrorMessage(obj[key]);
        if (msg) return msg;
      }
      return null;
    };

    const errorMsg = getErrorMessage(errors);
    toast.error(errorMsg || "Validation failed. Please check all steps.");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedPrompt);
    setIsCopied(true);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedPrompt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-readme-prompt.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Prompt downloaded!");
  };

  const openAI = (baseUrl: string) => {
    handleCopy();
    window.open(baseUrl, "_blank");
    toast.info("Redirecting... Don't forget to paste the prompt!");
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(step);
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep((s) => Math.min(s + 1, STEPS.length));
    } else {
      toast.error("Please fix the errors before continuing");
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const getFieldsForStep = (stepIdx: number): Array<keyof PromptBuilderData> => {
    switch (stepIdx) {
      case 0: return ["fullName", "role", "tagline", "bio"];
      case 1: return ["socials"];
      case 2: return ["aboutMeLong"];
      case 3: return ["focusAreas"];
      case 4: return ["techStack"];
      case 5: return ["projects"];
      case 6: return form.watch("showOpenSource") ? ["openSourceProjects"] : [];
      case 7: return ["learning", "goals", "quote"];
      case 8: return ["style", "sectionsToInclude"];
      default: return [];
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0: // Basic Info
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input {...form.register("fullName")} placeholder="John Doe" />
                {form.formState.errors.fullName && <p className="text-xs text-destructive">{form.formState.errors.fullName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Professional Role / Title</Label>
                <Input {...form.register("role")} placeholder="AI Engineer" />
                {form.formState.errors.role && <p className="text-xs text-destructive">{form.formState.errors.role.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Short Tagline</Label>
              <Input {...form.register("tagline")} placeholder="Building AI Products & Open Source Tools" />
              {form.formState.errors.tagline && <p className="text-xs text-destructive">{form.formState.errors.tagline.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Short Bio</Label>
              <Textarea {...form.register("bio")} placeholder="Passionate developer focused on AI..." />
              {form.formState.errors.bio && <p className="text-xs text-destructive">{form.formState.errors.bio.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location (Optional)</Label>
                <Input {...form.register("location")} placeholder="San Francisco, CA" />
              </div>
              <div className="space-y-2">
                <Label>Portfolio Website (Optional)</Label>
                <Input {...form.register("portfolioWebsite")} placeholder="https://johndoe.com" />
                {form.formState.errors.portfolioWebsite && <p className="text-xs text-destructive">{form.formState.errors.portfolioWebsite.message}</p>}
              </div>
            </div>
          </div>
        );

      case 1: // Social Links
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(form.getValues().socials) as Array<keyof PromptBuilderData["socials"]>).map((key) => (
              <div key={key} className="space-y-2">
                <Label className="capitalize">{key === 'devto' ? 'Dev.to' : key} URL</Label>
                <Input {...form.register(`socials.${key}`)} placeholder={`https://${key}.com/username`} />
                {form.formState.errors.socials?.[key] && (
                  <p className="text-xs text-destructive">{form.formState.errors.socials[key]?.message}</p>
                )}
              </div>
            ))}
          </div>
        );

      case 2: // About Me
        return (
          <div className="space-y-4">
            <Label>Tell us more about yourself</Label>
            <p className="text-sm text-muted-foreground">Who are you? What do you enjoy building? What makes you unique?</p>
            <Textarea 
              {...form.register("aboutMeLong")} 
              className="min-h-[200px]"
              placeholder="I am a software engineer with a passion for..." 
            />
            {form.formState.errors.aboutMeLong && <p className="text-xs text-destructive">{form.formState.errors.aboutMeLong.message}</p>}
          </div>
        );

      case 3: // Focus Areas
        return (
          <div className="space-y-4">
            <Label>What are your main focus areas?</Label>
            <div className="flex flex-wrap gap-2">
              {FOCUS_OPTIONS.map((area) => {
                const isSelected = form.watch("focusAreas").includes(area);
                return (
                  <Badge
                    key={area}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer py-1.5 px-3"
                    onClick={() => {
                      const current = form.getValues("focusAreas");
                      if (isSelected) {
                        form.setValue("focusAreas", current.filter(a => a !== area));
                      } else {
                        form.setValue("focusAreas", [...current, area]);
                      }
                    }}
                  >
                    {area}
                  </Badge>
                );
              })}
            </div>
            {form.formState.errors.focusAreas && (
              <p className="text-xs text-destructive mt-2">{form.formState.errors.focusAreas.message}</p>
            )}
            <div className="flex gap-2">
              <Input 
                placeholder="Add custom focus area..." 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = e.currentTarget.value.trim();
                    if (val && !form.getValues("focusAreas").includes(val)) {
                      form.setValue("focusAreas", [...form.getValues("focusAreas"), val]);
                      e.currentTarget.value = "";
                    }
                  }
                }}
              />
            </div>
          </div>
        );

      case 4: // Tech Stack
        return (
          <div className="space-y-4">
            <Label className="text-muted-foreground text-sm">Select the technologies you use. Icons from skillicons.dev will be included in your prompt.</Label>
            <SkillSelector
              selectedSkills={form.watch("techStack")}
              onChange={(skills) => form.setValue("techStack", skills)}
            />
            {form.formState.errors.techStack && (
              <p className="text-xs text-destructive mt-2">{form.formState.errors.techStack.message}</p>
            )}
          </div>
        );

      case 5: // Projects
        return (
          <div className="space-y-6">
            <Label>Featured Projects</Label>
            {projectFields.map((field, index) => (
              <Card key={field.id} className="p-4 bg-muted/30 relative">
                <Button 
                  variant="ghost" size="icon" 
                  className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removeProject(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Project Name</Label>
                      <Input {...form.register(`projects.${index}.name`)} placeholder="My Awesome App" />
                      {form.formState.errors.projects?.[index]?.name && (
                        <p className="text-xs text-destructive">{(form.formState.errors.projects as any)[index]?.name?.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Project URL</Label>
                      <Input {...form.register(`projects.${index}.url`)} placeholder="https://github.com/..." />
                      {form.formState.errors.projects?.[index]?.url && (
                        <p className="text-xs text-destructive">{(form.formState.errors.projects as any)[index]?.url?.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Project Description</Label>
                    <Textarea {...form.register(`projects.${index}.description`)} placeholder="A revolutionary app that..." />
                    {form.formState.errors.projects?.[index]?.description && (
                      <p className="text-xs text-destructive">{(form.formState.errors.projects as any)[index]?.description?.message}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            <Button variant="outline" className="w-full border-dashed" onClick={() => appendProject({ name: "", url: "", description: "" })}>
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </Button>
          </div>
        );

      case 6: // Open Source
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Open Source Projects</Label>
                <p className="text-sm text-muted-foreground">I want to showcase my Open Source contributions</p>
              </div>
              <Switch 
                checked={form.watch("showOpenSource")} 
                onCheckedChange={(val) => form.setValue("showOpenSource", val)}
              />
            </div>

            {form.watch("showOpenSource") && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                {osFields.map((field, index) => (
                  <Card key={field.id} className="p-4 bg-muted/30 relative">
                    <Button 
                      variant="ghost" size="icon" 
                      className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => removeOS(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Project Name</Label>
                          <Input {...form.register(`openSourceProjects.${index}.name`)} placeholder="Linux Kernel" />
                          {form.formState.errors.openSourceProjects?.[index]?.name && (
                            <p className="text-xs text-destructive">{(form.formState.errors.openSourceProjects as any)[index]?.name?.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Project URL</Label>
                          <Input {...form.register(`openSourceProjects.${index}.url`)} placeholder="https://github.com/torvalds/linux" />
                          {form.formState.errors.openSourceProjects?.[index]?.url && (
                            <p className="text-xs text-destructive">{(form.formState.errors.openSourceProjects as any)[index]?.url?.message}</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Project Description</Label>
                        <Textarea {...form.register(`openSourceProjects.${index}.description`)} placeholder="Contributed to memory management..." />
                        {form.formState.errors.openSourceProjects?.[index]?.description && (
                          <p className="text-xs text-destructive">{(form.formState.errors.openSourceProjects as any)[index]?.description?.message}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                <Button variant="outline" className="w-full border-dashed" onClick={() => appendOS({ name: "", url: "", description: "" })}>
                  <Plus className="mr-2 h-4 w-4" /> Add Open Source Project
                </Button>
              </div>
            )}
          </div>
        );

      case 7: // Learning & Goals & Quote
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Currently Learning (Press Enter)</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.watch("learning").map((item, i) => (
                  <Badge key={i} className="gap-1">{item} <Trash2 className="h-3 w-3 cursor-pointer" onClick={() => form.setValue("learning", form.getValues("learning").filter((_, idx) => idx !== i))} /></Badge>
                ))}
              </div>
              <Input placeholder="AI Agents, Rust, Next.js..." onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const val = e.currentTarget.value.trim();
                  if (val) { form.setValue("learning", [...form.getValues("learning"), val]); e.currentTarget.value = ""; }
                }
              }} />
              {form.formState.errors.learning && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.learning.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Future Goals (Press Enter)</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.watch("goals").map((item, i) => (
                  <Badge key={i} className="gap-1">{item} <Trash2 className="h-3 w-3 cursor-pointer" onClick={() => form.setValue("goals", form.getValues("goals").filter((_, idx) => idx !== i))} /></Badge>
                ))}
              </div>
              <Input placeholder="Contribute to Open Source, Build SaaS..." onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const val = e.currentTarget.value.trim();
                  if (val) { form.setValue("goals", [...form.getValues("goals"), val]); e.currentTarget.value = ""; }
                }
              }} />
              {form.formState.errors.goals && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.goals.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Quote / Motto (Optional)</Label>
              <Input {...form.register("quote")} placeholder="Turning imagination into software using code + AI." />
            </div>
          </div>
        );

      case 8: // Style & Sections
        return (
          <div className="space-y-8">
            <div className="space-y-3">
              <Label>README Style</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {STYLE_OPTIONS.map((styleOption) => (
                  <Button
                    key={styleOption}
                    variant={form.watch("style") === styleOption ? "default" : "outline"}
                    className="text-xs justify-start h-9"
                    onClick={() => form.setValue("style", styleOption as PromptBuilderData["style"])}
                  >
                    {styleOption}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Label>Sections to Include</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SECTION_OPTIONS.map((sec) => {
                  const isChecked = form.watch("sectionsToInclude").includes(sec);
                  return (
                    <div key={sec} className="flex items-center space-x-2">
                      <Switch 
                        checked={isChecked} 
                        size="sm"
                        onCheckedChange={(val) => {
                          const current = form.getValues("sectionsToInclude");
                          if (val) form.setValue("sectionsToInclude", [...current, sec]);
                          else form.setValue("sectionsToInclude", current.filter(s => s !== sec));
                        }}
                      />
                      <span className="text-xs">{sec}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 9: // Preview
        return (
          <div className="space-y-6 animate-in zoom-in-95">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-bold">Generated AI Prompt</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setStep(0)}><RotateCcw className="h-4 w-4 mr-2" /> Restart</Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}><Download className="h-4 w-4 mr-2" /> Download</Button>
                  <Button variant="default" size="sm" onClick={handleCopy}>
                    {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {isCopied ? "Copied" : "Copy Prompt"}
                  </Button>
                </div>
              </div>
              <div className="h-[400px] w-full rounded-md border border-border bg-muted/50 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/20">
                <pre className="text-xs font-mono whitespace-pre-wrap text-foreground/80 leading-relaxed">
                  {generatedPrompt}
                </pre>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="default" 
                className="bg-[#10a37f] hover:bg-[#10a37f]/90 text-white h-12"
                onClick={() => openAI("https://chat.openai.com/")}
              >
                <MessageSquare className="mr-2 h-5 w-5" /> Generate in ChatGPT
              </Button>
              <Button 
                variant="default" 
                className="bg-[#d97757] hover:bg-[#d97757]/90 text-white h-12"
                onClick={() => openAI("https://claude.ai/")}
              >
                <Sparkles className="mr-2 h-5 w-5" /> Generate with Claude
              </Button>
              <Button 
                variant="default" 
                className="bg-[#4285f4] hover:bg-[#4285f4]/90 text-white h-12"
                onClick={() => openAI("https://gemini.google.com/")}
              >
                <ExternalLink className="mr-2 h-5 w-5" /> Generate with Gemini
              </Button>
            </div>
          </div>
        );
      
      default: return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      {/* Progress Header */}
      <div className="px-6 py-4 border-b border-border bg-card/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Prompt Builder</h1>
            <p className="text-xs text-muted-foreground">Craft the perfect instructions for your AI-generated README</p>
          </div>
        </div>
        {step < STEPS.length && (
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="text-[10px] md:text-xs font-medium text-muted-foreground mr-1 md:mr-2">
              Step {step + 1} of {STEPS.length}
            </div>
            <div className="flex gap-1">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 w-3 md:h-1.5 md:w-6 rounded-full transition-colors ${i <= step ? "bg-amber-500" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent">
        <div className="max-w-4xl mx-auto p-6 pb-40">
          {step < STEPS.length && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">{STEPS[step]}</h2>
              <div className="h-1 w-12 bg-amber-500 rounded-full"></div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Footer */}
      {step < STEPS.length && (
        <div className="fixed bottom-0 left-0 md:left-16 right-0 border-t border-border bg-background/80 backdrop-blur-md p-4 px-6 flex justify-between items-center z-50">
          <Button 
            variant="ghost" 
            onClick={prevStep} 
            disabled={step === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2 text-destructive hover:bg-destructive/10" 
              onClick={() => {
                if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
                  localStorage.removeItem("readmesmith-prompt-data");
                  window.location.reload();
                }
              }}
            >
              <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline">Clear All</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => form.reset()}>
              <RotateCcw className="h-4 w-4" /> <span className="hidden sm:inline">Reset</span>
            </Button>
            {step === STEPS.length - 1 ? (
              <Button onClick={form.handleSubmit(onSubmit, onInvalid)} className="gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold">
                Generate AI Prompt <Sparkles className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={nextStep} className="gap-2">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
