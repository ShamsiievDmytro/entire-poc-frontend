import { ID_DISPLAY_LENGTH } from '../constants';

export function truncateId(id: string): string {
  if (id.length <= ID_DISPLAY_LENGTH) return id;
  return id.slice(0, ID_DISPLAY_LENGTH) + '...';
}
