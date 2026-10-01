import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

/** Published projects in display order. Drafts show in `astro dev` only. */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection(
    'projects',
    ({ data }) => import.meta.env.DEV || !data.draft,
  );
  return projects.sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.data.featured).slice(0, limit);
}

/** Every tag used by any project, alphabetically, for the /projects filter. */
export function allTags(projects: Project[]): string[] {
  return [...new Set(projects.flatMap((p) => p.data.stack))].sort();
}

export const projectHref = (project: Project) => `/projects/${project.id}`;
