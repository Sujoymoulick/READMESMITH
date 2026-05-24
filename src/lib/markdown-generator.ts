import { Section } from '../types';

export const generateMarkdown = (sections: Section[]): string => {
  return sections
    .filter((s) => s.enabled)
    .map((s) => {
      const c = s.content || {};

      switch (s.type) {
        case 'banner':
          return `<p align="center">\n  <img src="${c.url}" alt="Banner" width="100%">\n</p>\n`;
        
        case 'header':
          return `<h1 align="center">${c.title}</h1>\n<p align="center"><b>${c.subtitle}</b></p>\n`;
        
        case 'intro':
          const items = [
            c.workingOn && `<li>🔭 I’m currently working on <b>${c.workingOn}</b></li>`,
            c.learning && `<li>🌱 I’m currently learning <b>${c.learning}</b></li>`,
            c.collaboration && `<li>👯 I’m looking to collaborate on <b>${c.collaboration}</b></li>`,
            c.help && `<li>🤔 I’m looking for help with <b>${c.help}</b></li>`,
            c.askMe && `<li>💬 Ask me about <b>${c.askMe}</b></li>`,
            c.contact && `<li>📫 How to reach me <b>${c.contact}</b></li>`,
            c.pronouns && `<li>😄 Pronouns: <b>${c.pronouns}</b></li>`,
            c.funFact && `<li>⚡ Fun fact: <b>${c.funFact}</b></li>`,
          ].filter(Boolean).join('\n');
          
          if (c.illustrationUrl) {
            return `<div>\n<table border="0">\n  <tr>\n    <td width="50%" valign="top">\n      <ul style="list-style-type: none; padding-left: 0;">\n        ${items}\n      </ul>\n    </td>\n    <td width="50%" valign="top">\n      <img src="${c.illustrationUrl}" width="100%" />\n    </td>\n  </tr>\n</table>\n</div>\n`;
          }
          return `<ul>\n${items}\n</ul>\n`;

        case 'about':
          return `## ${s.title}\n\n${c.text}\n`;
        
        case 'skills':
          const slugs = (c.skills || []).map((sk: any) => sk.slug).join(',');
          if (!slugs) return '';
          return `### Languages and Tools:\n\n<p align="left">\n<a href="https://skillicons.dev">\n<img src="https://skillicons.dev/icons?i=${slugs}&perline=20" style="height: 50px;" />\n</a>\n</p>\n`;
        
        case 'projects':
          const projectsList = (c.projects || [])
            .map((p: any) => `### [${p.name}](${p.link})\n${p.description}\n**Tech:** ${p.tech.join(', ')}\n`)
            .join('\n');
          return `## Projects\n\n${projectsList}\n`;
        
        case 'socials':
          const style = c.style || 'sustainable';
          const socialsLinks = (c.socials || [])
            .filter((soc: any) => soc.url && soc.url.trim() !== "")
            .map((soc: any) => {
              const platform = soc.platform.toLowerCase();
              if (style === 'sustainable') {
                const categories: Record<string, string> = {
                  linkedin: 'social media',
                  twitter: 'social media',
                  x: 'social media',
                  facebook: 'social media',
                  instagram: 'social media',
                  youtube: 'social media',
                  discord: 'social media',
                  github: 'technology',
                  upwork: 'technology',
                };

                const category = categories[platform];
                if (category) {
                  const encodedCategory = encodeURIComponent(category);
                  return `<a href="${soc.url}" target="_blank"><img src="https://raw.githubusercontent.com/dheereshag/coloured-icons/master/public/logos/${encodedCategory}/${platform}/${platform}.svg" style="height: 28px; display: inline-block; margin-right: 10px;" alt="${soc.platform}" /></a>`;
                }
              }
              // Default to Shields.io badges
              return `<a href="${soc.url}" target="_blank"><img src="https://img.shields.io/badge/${soc.platform}-%23121011.svg?style=for-the-badge&logo=${platform}&logoColor=white" style="height: 28px; display: inline-block; margin-right: 10px;" alt="${soc.platform}" /></a>`;
            })
            .join('');
          
          if (!socialsLinks) return '';
          return `## Connect with me:\n\n<p align="left">${socialsLinks}</p>\n`;
        
        case 'snake':
          return `### GitHub Contribution Snake\n\n<div align="center">\n  <img src="https://profile-readme-generator.com/assets/snake.svg" alt="Snake animation" />\n</div>\n`;
        
        case 'gif':
          const align = c.align || 'center';
          const height = c.height ? ` height="${c.height}"` : '';
          if (!c.url) return '';
          return `<div align="${align}">\n  <img src="${c.url}"${height} alt="GIF" />\n</div>\n`;

        case 'streak':
          if (!c.username) return '';
          return `### GitHub Streak Stats\n\n<div align="center">\n  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${c.username}&theme=${c.theme || 'radical'}" alt="GitHub Streak" />\n</div>\n`;

        case 'profile-details':
          const points = (c.points || [])
            .map((p: any, i: number) => `### ${i + 1}. ${p.title}\n${p.text}`)
            .join('\n\n');
          return `## 💻 ${s.title}\n\n${c.intro}\n\n${points}\n\n### 🌱 What You Can Expect\n\n${c.expect}\n`;

        case 'custom':
          return `## ${s.title}\n\n${c.text}\n`;
        
        case 'footer':
          return `----- \n\n<p align="center">\n  <i>Generated with <a href="https://github.com/sujoymoulick/readme-generator">README Generator</a></i><br>\n  Stats by <a href="https://github.com/anuraghazra/github-readme-stats">anuraghazra</a> and <a href="https://github.com/DenverCoder1/github-readme-streak-stats">DenverCoder1</a>. Icons by <a href="https://skillicons.dev">tandpfun</a>.\n</p>\n`;

        default:
          return '';
      }
    })
    .join('\n');
};
