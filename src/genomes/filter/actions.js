import { stateKey } from './filter';

import { update } from '../../filter';

export function filterByArea(path) {
  return update(stateKey, { key: 'area' }, path);
}
