export type SectionType = 
  | 'banner'
  | 'header' 
  | 'intro'
  | 'about' 
  | 'skills' 
  | 'projects' 
  | 'streak'
  | 'socials' 
  | 'snake' 
  | 'gif'
  | 'profile-details'
  | 'custom'
  | 'footer';

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  content: any;
  enabled: boolean;
}

export interface Skill {
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'tools' | 'ai' | 'devops' | 'mobile' | 'database';
}

export interface Social {
  platform: string;
  username: string;
  url: string;
}

export interface Project {
  name: string;
  description: string;
  link: string;
  tech: string[];
}

export interface READMEData {
  sections: Section[];
  theme: 'light' | 'dark';
}
