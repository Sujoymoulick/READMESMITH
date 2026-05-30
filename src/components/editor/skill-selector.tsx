"use client";

import { useState } from "react";
import { SKILLS_DATA, CATEGORIES, SkillItem } from "@/constants/skills";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillSelectorProps {
  selectedSkills?: any[] | null;
  onChange: (skills: any[]) => void;
}

export function SkillSelector({ selectedSkills = [], onChange }: SkillSelectorProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");

  const safeSelectedSkills = Array.isArray(selectedSkills) ? selectedSkills : [];

  const toggleSkill = (skill: SkillItem) => {
    const isSelected = safeSelectedSkills.some((s) => s.slug === skill.slug);
    if (isSelected) {
      onChange(safeSelectedSkills.filter((s) => s.slug !== skill.slug));
    } else {
      onChange([...safeSelectedSkills, { name: skill.name, slug: skill.slug }]);
    }
  };

  const filteredSkills = SKILLS_DATA.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search skills..."
            className="pl-10 bg-card border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="bg-card border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-8">
        {CATEGORIES.filter(cat => selectedCategory === "all" || cat === selectedCategory).map((category) => {
          const categorySkills = filteredSkills.filter((s) => s.category === category);
          if (categorySkills.length === 0) return null;

          return (
            <div key={category} className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {categorySkills.map((skill) => {
                  const isSelected = safeSelectedSkills.some((s) => s.slug === skill.slug);
                  return (
                    <button
                      key={skill.slug}
                      onClick={() => toggleSkill(skill)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all text-left group",
                        isSelected
                          ? "bg-amber-600/10 border-amber-500 text-white"
                          : "bg-muted/50 border-border text-muted-foreground hover:border-border/80 hover:bg-muted"
                      )}
                    >
                      <div className="relative h-10 w-10 shrink-0 flex items-center justify-center">
                        <img
                          src={`https://skillicons.dev/icons?i=${skill.slug}`}
                          alt={skill.name}
                          className={cn("h-10 w-10 object-contain", !isSelected && "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100")}
                        />
                      </div>
                      <span className="text-sm font-medium truncate">{skill.name}</span>
                      {isSelected && <Check className="h-4 w-4 ml-auto text-amber-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
