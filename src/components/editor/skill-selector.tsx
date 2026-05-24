"use client";

import { useState } from "react";
import { SKILLS_DATA, CATEGORIES, SkillItem } from "@/constants/skills";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillSelectorProps {
  selectedSkills: any[];
  onChange: (skills: any[]) => void;
}

export function SkillSelector({ selectedSkills, onChange }: SkillSelectorProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");

  const toggleSkill = (skill: SkillItem) => {
    const isSelected = selectedSkills.some((s) => s.slug === skill.slug);
    if (isSelected) {
      onChange(selectedSkills.filter((s) => s.slug !== skill.slug));
    } else {
      onChange([...selectedSkills, { name: skill.name, slug: skill.slug }]);
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search skills..."
            className="pl-10 bg-zinc-900 border-zinc-800"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="bg-zinc-900 border border-zinc-800 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
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
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                {category}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {categorySkills.map((skill) => {
                  const isSelected = selectedSkills.some((s) => s.slug === skill.slug);
                  return (
                    <button
                      key={skill.slug}
                      onClick={() => toggleSkill(skill)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all text-left group",
                        isSelected
                          ? "bg-blue-600/10 border-blue-500 text-white"
                          : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800"
                      )}
                    >
                      <div className="relative h-6 w-6 shrink-0 flex items-center justify-center">
                        <img
                          src={`https://skillicons.dev/icons?i=${skill.slug}`}
                          alt={skill.name}
                          className={cn("h-6 w-6 object-contain", !isSelected && "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100")}
                        />
                      </div>
                      <span className="text-sm font-medium truncate">{skill.name}</span>
                      {isSelected && <Check className="h-4 w-4 ml-auto text-blue-500" />}
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
