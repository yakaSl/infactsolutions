import { projects } from './projects-data';

export type ContributionTargetKind = 'project' | 'general' | 'other';

export interface ContributionTarget {
  slug: string;
  label: string;
  kind: ContributionTargetKind;
  projectId?: number;
}

const generalTargets: ContributionTarget[] = [
  {
    slug: 'infact-growth',
    label: 'Infact Solutions Growth / R&D',
    kind: 'general',
  },
  {
    slug: 'any-project',
    label: 'Any project — let Infact Solutions allocate',
    kind: 'general',
  },
  {
    slug: 'other',
    label: 'Other / General company investment',
    kind: 'other',
  },
];

function projectsAsTargets(): ContributionTarget[] {
  return projects.map((p) => ({
    slug: `project-${p.id}`,
    label: p.title,
    kind: 'project' as const,
    projectId: p.id,
  }));
}

export const contributionTargets: ContributionTarget[] = [
  ...projectsAsTargets(),
  ...generalTargets,
];

export function findContributionTarget(slug: string): ContributionTarget | undefined {
  return contributionTargets.find((t) => t.slug === slug);
}
