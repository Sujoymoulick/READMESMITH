"use client";

import { Card } from "@/components/ui/card";
import { ExternalLink, Code2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONTRIBUTORS = [
  {
    name: "Dheeresh Agarwal",
    repo: "dheereshag/coloured-icons",
    description: "Provider of the vibrant brand and tech logos used in our Sustainable Buttons.",
    link: "https://github.com/dheereshag/coloured-icons"
  },
  {
    name: "RIZAL KHAN",
    repo: "tandpfun/skill-icons",
    description: "The magic behind the beautiful skill icons and tech stack visualization.",
    link: "https://github.com/tandpfun/skill-icons"
  },
  {
    name: "Anurag Hazra",
    repo: "anuraghazra/github-readme-stats",
    description: "Powering the dynamic GitHub statistics and streak cards.",
    link: "https://github.com/anuraghazra/github-readme-stats"
  },
  {
    name: "Abhishek Naidu",
    repo: "abhisheknaiidu/awesome-github-profile-readme",
    description: "Inspiration and resource for high-quality README templates.",
    link: "https://github.com/abhisheknaiidu/awesome-github-profile-readme"
  },
  {
    name: "Platane",
    repo: "Platane/snk",
    description: "The creator of the amazing GitHub contribution snake animation.",
    link: "https://github.com/Platane/snk"
  }
];

export function ContributorsPage() {
  return (
    <div className="flex-1 overflow-auto p-4 md:p-8 bg-zinc-950">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Credits & Contributors
          </h2>
          <p className="text-zinc-400 text-sm">
            This project is powered by these amazing open-source repositories and their contributors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONTRIBUTORS.map((contributor) => (
            <Card key={contributor.repo} className="bg-zinc-900 border-zinc-800 p-6 hover:border-zinc-700 transition-colors group">
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-zinc-100">{contributor.name}</h3>
                    <Code2 className="h-5 w-5 text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-xs text-blue-400 font-mono">{contributor.repo}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {contributor.description}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2 border-zinc-800 hover:bg-zinc-800"
                  onClick={() => window.open(contributor.link, "_blank")}
                >
                  <ExternalLink className="h-3 w-3" /> View Repository
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 p-8 text-center space-y-4">
          <Heart className="h-8 w-8 text-red-500 mx-auto fill-red-500" />
          <h3 className="text-xl font-bold">Support Open Source</h3>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto">
            If you love this tool, please consider giving a star to the repositories mentioned above. 
            Their hard work makes this generator possible.
          </p>
        </Card>
      </div>
    </div>
  );
}
