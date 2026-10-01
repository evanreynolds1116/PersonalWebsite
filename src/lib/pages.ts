import { site } from '../config/site';
import { getProjects } from './projects';

/**
 * Every public page, for the sitemap and the Open Graph images. The post-build
 * step (scripts/postbuild.mjs) fails if a built page is missing from here.
 */
export interface PageEntry {
  /** URL path, e.g. `/projects/project-one`. */
  path: string;
  /** Listed in sitemap.xml. */
  indexed: boolean;
  /** Open Graph image content. */
  og: {
    /** Prompt directory, e.g. `~/projects`. */
    dir: string;
    command: string;
    title: string;
    subtitle: string;
  };
}

/** Share-image file name for a URL path: `/` → `home`, `/projects/x` → `projects-x`. */
export function ogKey(pathname: string): string {
  return pathname.replace(/^\/+|\/+$/g, '').replace(/\//g, '-') || 'home';
}

export async function getPages(): Promise<PageEntry[]> {
  const projects = await getProjects();
  const home = `~/${site.handle}`;

  return [
    {
      path: '/',
      indexed: true,
      og: { dir: home, command: 'whoami', title: site.name, subtitle: site.role },
    },
    {
      path: '/projects',
      indexed: true,
      og: {
        dir: '~/projects',
        command: 'ls',
        title: 'Projects',
        subtitle: 'Case studies: the problem, my role, the decisions and the results.',
      },
    },
    ...projects.map((project) => ({
      path: `/projects/${project.id}`,
      indexed: true,
      og: {
        dir: `~/projects/${project.id}`,
        command: 'cat README.md',
        title: project.data.title,
        subtitle: project.data.summary,
      },
    })),
    {
      path: '/resume',
      indexed: true,
      og: { dir: '~/resume', command: 'cat resume.json', title: 'Resume', subtitle: site.role },
    },
    {
      path: '/services',
      indexed: true,
      og: {
        dir: '~/freelance',
        command: 'cat services.txt',
        title: 'Services',
        subtitle: 'What I build, how an engagement works, and where pricing starts.',
      },
    },
    {
      path: '/about',
      indexed: true,
      og: { dir: '~/about', command: 'cat bio.md', title: 'About', subtitle: site.description },
    },
    {
      path: '/contact',
      indexed: true,
      og: {
        dir: '~/contact',
        command: './send-message',
        title: 'Get in touch',
        subtitle: `Hiring for a role or planning a project? ${site.replyTime}`,
      },
    },
    {
      path: '/uses',
      indexed: true,
      og: {
        dir: '~/uses',
        command: 'ls -la',
        title: 'Uses',
        subtitle: 'The editor, terminal, hardware and tools I use every day.',
      },
    },
    {
      path: '/404',
      indexed: false,
      og: {
        dir: '~',
        command: 'cd /that-page',
        title: 'command not found',
        subtitle: "That page doesn't exist, or it has moved.",
      },
    },
  ];
}
