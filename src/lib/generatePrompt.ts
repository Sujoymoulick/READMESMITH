import { PromptBuilderData } from "@/types/prompt-builder";
import { SKILLS_DATA } from "@/constants/skills";

export function generateReadmePrompt(data: PromptBuilderData): string {
  const {
    fullName,
    role,
    tagline,
    bio,
    location,
    portfolioWebsite,
    socials,
    aboutMeLong,
    focusAreas,
    techStack,
    projects,
    showOpenSource,
    openSourceProjects,
    learning,
    goals,
    quote,
    style,
    sectionsToInclude,
  } = data;

  const socialLinksStr = Object.entries(socials)
    .filter(([_, url]) => url)
    .map(([platform, url]) => `- ${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${url}`)
    .join("\n");

  // Group skills by category for better prompt structure
  const groupedTechStack: Record<string, string[]> = {};
  techStack.forEach((skill) => {
    const skillData = SKILLS_DATA.find((s) => s.slug === skill.slug);
    const category = skillData ? skillData.category : "Other";
    if (!groupedTechStack[category]) {
      groupedTechStack[category] = [];
    }
    groupedTechStack[category].push(skill.name);
  });

  const techStackStr = Object.entries(groupedTechStack)
    .map(([category, skills]) => `- ${category}: ${skills.join(", ")}`)
    .join("\n");

  const projectsStr = projects
    .map((p) => `### ${p.name}\n- URL: ${p.url || "N/A"}\n- Description: ${p.description}`)
    .join("\n\n");

  const openSourceStr = showOpenSource
    ? openSourceProjects
        .map((p) => `### ${p.name}\n- URL: ${p.url || "N/A"}\n- Description: ${p.description}`)
        .join("\n\n")
    : "";

  const prompt = `
Act as an expert Developer Relations Engineer and Senior Full Stack Developer. Your goal is to generate a world-class, production-quality GitHub Profile README for me. This README should be visually stunning, informative, and perfectly formatted using GitHub-flavored Markdown.

I want the style of the README to be: ${style}.

Here is all the detailed information about me:

### 1. BASIC INFORMATION
- Full Name: ${fullName}
* Professional Role/Title: ${role}
- Tagline: ${tagline}
- Short Bio: ${bio}
${location ? `- Location: ${location}` : ""}
${portfolioWebsite ? `- Portfolio Website: ${portfolioWebsite}` : ""}

### 2. SOCIAL LINKS
${socialLinksStr || "None provided"}

### 3. ABOUT ME (EXTENDED)
${aboutMeLong}

### 4. FOCUS AREAS
I am deeply focused and passionate about the following areas:
${focusAreas.map((area) => `- ${area}`).join("\n")}

### 5. TECHNICAL STACK
My expertise spans across these technologies:
${techStackStr || "None provided"}

### 6. FEATURED PROJECTS
These are some of my best works:
${projectsStr || "None provided"}

${showOpenSource && openSourceProjects.length > 0 ? `### 7. OPEN SOURCE CONTRIBUTIONS\n${openSourceStr}` : ""}

### 8. CURRENTLY LEARNING
I am actively expanding my knowledge in:
${learning.map((l) => `- ${l}`).join("\n") || "None provided"}

### 9. FUTURE GOALS
My current objectives and aspirations are:
${goals.map((g) => `- ${g}`).join("\n") || "None provided"}

${quote ? `### 10. MOTTO / QUOTE\n"${quote}"` : ""}

### INSTRUCTIONS FOR THE README GENERATION:

1. **Sections to Include**: Please ensure the following sections are represented in the README: ${sectionsToInclude.join(", ")}.
2. **Visual Impact**: Use high-quality SVG badges (e.g., from Shields.io or SkillIcons) for the tech stack and social links.
3. **Interactive Elements**: Include placeholders or instructions for adding GitHub Stats cards, Top Languages cards, and the GitHub Streak Stat. If "Snake Animation" was requested, include a section showing the snake contribution animation.
4. **Layout**: Use a mix of grids, tables, and lists to make the content readable and professional. For the intro, consider a side-by-side layout with an illustration or a centered banner.
5. **Tone**: Maintain a tone that is consistent with the "${style}" style. If it's "Futuristic", use bold emojis and tech-forward language. If it's "Minimal", keep it clean and whitespace-heavy.
6. **Code Blocks**: Use appropriate syntax highlighting where necessary.
7. **Accessibility**: Ensure all images have descriptive alt text.
8. **Navigation**: If the README is long, include a "Back to top" link or a small table of contents.
9. **Visitor Counter**: If requested, include a visitor counter badge using a service like 'hits.seeyoufarm.com' or 'count.getloli.com'.
10. **Typing Effect**: If "Typing Banner" is requested, suggest a way to implement it using 'readme-typing-svg'.

Please provide the complete, final Markdown code in a single code block so I can copy and paste it directly into my README.md file. Ensure every piece of information I provided is integrated thoughtfully. DO NOT hold back on detail—I want a comprehensive and impressive profile.

Generate the output now.
`;

  return prompt.trim();
}
