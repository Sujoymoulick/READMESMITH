export interface SkillItem {
  name: string;
  slug: string; // slug for skillicons.dev
  category: string;
}

export const SKILLS_DATA: SkillItem[] = [
  // Programming Languages
  { name: "C", slug: "c", category: "Programming Languages" },
  { name: "C++", slug: "cpp", category: "Programming Languages" },
  { name: "C#", slug: "cs", category: "Programming Languages" },
  { name: "Go", slug: "go", category: "Programming Languages" },
  { name: "Java", slug: "java", category: "Programming Languages" },
  { name: "JavaScript", slug: "js", category: "Programming Languages" },
  { name: "TypeScript", slug: "ts", category: "Programming Languages" },
  { name: "Python", slug: "py", category: "Programming Languages" },
  { name: "PHP", slug: "php", category: "Programming Languages" },
  { name: "Ruby", slug: "ruby", category: "Programming Languages" },
  { name: "Swift", slug: "swift", category: "Programming Languages" },
  { name: "Rust", slug: "rust", category: "Programming Languages" },
  { name: "Kotlin", slug: "kotlin", category: "Programming Languages" },
  { name: "Dart", slug: "dart", category: "Programming Languages" },
  { name: "Lua", slug: "lua", category: "Programming Languages" },

  // Frontend
  { name: "React", slug: "react", category: "Frontend Development" },
  { name: "Next.js", slug: "nextjs", category: "Frontend Development" },
  { name: "Vue.js", slug: "vue", category: "Frontend Development" },
  { name: "Angular", slug: "angular", category: "Frontend Development" },
  { name: "Svelte", slug: "svelte", category: "Frontend Development" },
  { name: "Tailwind CSS", slug: "tailwind", category: "Frontend Development" },
  { name: "Bootstrap", slug: "bootstrap", category: "Frontend Development" },
  { name: "HTML5", slug: "html", category: "Frontend Development" },
  { name: "CSS3", slug: "css", category: "Frontend Development" },
  { name: "Sass", slug: "sass", category: "Frontend Development" },
  { name: "Redux", slug: "redux", category: "Frontend Development" },
  { name: "Vite", slug: "vite", category: "Frontend Development" },

  // Backend
  { name: "Node.js", slug: "nodejs", category: "Backend Development" },
  { name: "Express", slug: "express", category: "Backend Development" },
  { name: "NestJS", slug: "nestjs", category: "Backend Development" },
  { name: "Django", slug: "django", category: "Backend Development" },
  { name: "Flask", slug: "flask", category: "Backend Development" },
  { name: "Spring Boot", slug: "spring", category: "Backend Development" },
  { name: "Laravel", slug: "laravel", category: "Backend Development" },

  // Database
  { name: "MongoDB", slug: "mongodb", category: "Database" },
  { name: "MySQL", slug: "mysql", category: "Database" },
  { name: "PostgreSQL", slug: "postgres", category: "Database" },
  { name: "Redis", slug: "redis", category: "Database" },
  { name: "SQLite", slug: "sqlite", category: "Database" },
  { name: "Cassandra", slug: "cassandra", category: "Database" },

  // DevOps / Cloud
  { name: "Docker", slug: "docker", category: "DevOps" },
  { name: "Kubernetes", slug: "kubernetes", category: "DevOps" },
  { name: "AWS", slug: "aws", category: "DevOps" },
  { name: "Google Cloud", slug: "gcp", category: "DevOps" },
  { name: "Azure", slug: "azure", category: "DevOps" },
  { name: "Vercel", slug: "vercel", category: "DevOps" },
  { name: "Firebase", slug: "firebase", category: "DevOps" },
  { name: "Terraform", slug: "terraform", category: "DevOps" },
  { name: "Nginx", slug: "nginx", category: "DevOps" },

  // Tools
  { name: "Git", slug: "git", category: "Tools" },
  { name: "GitHub", slug: "github", category: "Tools" },
  { name: "GitLab", slug: "gitlab", category: "Tools" },
  { name: "VS Code", slug: "vscode", category: "Tools" },
  { name: "Postman", slug: "postman", category: "Tools" },
  { name: "Figma", slug: "figma", category: "Tools" },
  { name: "Linux", slug: "linux", category: "Tools" },
  { name: "Docker", slug: "docker", category: "Tools" },
];

export const CATEGORIES = Array.from(new Set(SKILLS_DATA.map(s => s.category)));
