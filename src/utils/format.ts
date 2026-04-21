export function truncateId(id: string): string {
  return id.slice(0, 8) + '...';
}
