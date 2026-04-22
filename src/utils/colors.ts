// Color utilities for dashboard charts and badges
// Centralized color mapping for consistent styling across components

export const REPO_BADGE_COLORS: Record<string, string> = {
  'entire-poc-backend': 'bg-indigo-100 text-indigo-800',
  'entire-poc-frontend': 'bg-amber-100 text-amber-800',
  'entire-poc-workspace': 'bg-green-100 text-green-800',
};

export function getRepoBadgeColor(repo: string): string {
  return REPO_BADGE_COLORS[repo] ?? 'bg-gray-100 text-gray-800';
}
