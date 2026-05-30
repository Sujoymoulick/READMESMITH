"use client";

import { useEffect, useState } from "react";
import { Section, READMEData } from "../types";

const STORAGE_KEY = "readme_generator_data";

const DEFAULT_SECTIONS: Section[] = [
  {
    id: "banner-1",
    type: "banner",
    title: "Banner",
    enabled: true,
    content: {
      url: "https://i.ibb.co/pW4m4zM/banner.png",
    },
  },
  {
    id: "header-1",
    type: "header",
    title: "Header",
    enabled: true,
    content: {
      title: "Hi 👋, I'm [Your Name]",
      subtitle: "A passionate developer from [Your Location]",
    },
  },
  {
    id: "intro-1",
    type: "intro",
    title: "Introduction",
    enabled: true,
    content: {
      workingOn: "My Awesome Project",
      learning: "New Technologies and Frameworks",
      askMe: "Development and Design",
      contact: "your-email@example.com",
      funFact: "I love building things!",
      illustrationUrl: "https://raw.githubusercontent.com/abhisheknaiidu/abhisheknaiidu/master/code.gif",
    },
  },
  {
    id: "skills-1",
    type: "skills",
    title: "Skills",
    enabled: true,
    content: {
      skills: [
        { name: "React", category: "frontend" },
        { name: "TypeScript", category: "frontend" },
        { name: "Node.js", category: "backend" },
      ],
    },
  },
  {
    id: "streak-1",
    type: "streak",
    title: "GitHub Streak",
    enabled: true,
    content: {
      username: "[your-github-username]",
      theme: "radical",
    },
  },
  {
    id: "footer-1",
    type: "footer",
    title: "Footer & Credits",
    enabled: true,
    content: {},
  },
];

export function useREADME() {
  const [data, setData] = useState<READMEData>({
    sections: DEFAULT_SECTIONS,
    theme: "dark",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateSection = (id: string, updates: Partial<Section>) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const addSection = (section: Section) => {
    setData((prev) => ({
      ...prev,
      sections: [...prev.sections, section],
    }));
  };

  const removeSection = (id: string) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== id),
    }));
  };

  const reorderSections = (newSections: Section[]) => {
    setData((prev) => ({
      ...prev,
      sections: newSections,
    }));
  };

  return {
    data,
    setData,
    updateSection,
    addSection,
    removeSection,
    reorderSections,
  };
}
