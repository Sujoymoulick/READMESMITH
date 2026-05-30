import { z } from "zod";

const projectSchema = z.object({
  name: z.string().min(1, "Featured project name is required"),
  url: z.string().optional().or(z.literal("")),
  description: z.string().min(5, "Featured project description is required (min 5 chars)"),
});

const osProjectBaseSchema = z.object({
  name: z.string().optional(),
  url: z.string().optional().or(z.literal("")),
  description: z.string().optional(),
});

export const promptSchema = z.object({
  // Section 1: Basic Info
  fullName: z.string().min(2, "Full name is required"),
  role: z.string().min(2, "Professional role is required"),
  tagline: z.string().min(5, "Tagline should be descriptive"),
  bio: z.string().min(10, "Bio should be at least 10 characters"),
  location: z.string().optional(),
  portfolioWebsite: z.string().optional().or(z.literal("")),

  // Section 2: Social Links
  socials: z.object({
    github: z.string().optional().or(z.literal("")),
    linkedin: z.string().optional().or(z.literal("")),
    twitter: z.string().optional().or(z.literal("")),
    youtube: z.string().optional().or(z.literal("")),
    portfolio: z.string().optional().or(z.literal("")),
    devto: z.string().optional().or(z.literal("")),
    hashnode: z.string().optional().or(z.literal("")),
  }),

  // Section 3: About Me
  aboutMeLong: z.string().min(20, "Please provide more details about yourself (min 20 chars)"),

  // Section 4: Focus Areas
  focusAreas: z.array(z.string()).min(1, "Select at least one focus area"),

  // Section 5: Tech Stack
  techStack: z.array(z.object({
    name: z.string(),
    slug: z.string(),
  })).min(1, "Select at least one technology"),

  // Section 6: Featured Projects
  projects: z.array(projectSchema),

  // Section 7: Open Source
  showOpenSource: z.boolean(),
  openSourceProjects: z.array(osProjectBaseSchema),

  // Section 8: Currently Learning
  learning: z.array(z.string()).min(1, "Add at least one thing you are learning"),

  // Section 9: Goals
  goals: z.array(z.string()).min(1, "Add at least one goal"),

  // Section 10: Quote
  quote: z.string().optional(),

  // Section 11: Style
  style: z.enum([
    "Professional",
    "Modern",
    "Minimal",
    "Futuristic",
    "Creative",
    "Portfolio Style",
    "Open Source Maintainer Style"
  ]),

  // Section 12: Sections to Include
  sectionsToInclude: z.array(z.string()),
}).superRefine((data, ctx) => {
  if (data.showOpenSource) {
    if (!data.openSourceProjects || data.openSourceProjects.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please add at least one open source project or disable the section",
        path: ["openSourceProjects"],
      });
    } else {
      data.openSourceProjects.forEach((proj, idx) => {
        if (!proj.name || proj.name.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Open source project name is required",
            path: ["openSourceProjects", idx, "name"],
          });
        }
        if (!proj.description || proj.description.trim().length < 5) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Open source project description is required (min 5 chars)",
            path: ["openSourceProjects", idx, "description"],
          });
        }
      });
    }
  }
});

export type PromptBuilderData = z.infer<typeof promptSchema>;
