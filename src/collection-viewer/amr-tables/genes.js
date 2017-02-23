const { onHeaderClick } = require('./thunks');

import { tableKeys } from '../constants';
import { createAdvancedViewColumn, getLabel } from './utils';

export const name = tableKeys.genes;

export function buildColumns({ paar, antibiotics }, profiles) {
  return antibiotics.reduce((groups, { key, fullName }) => {
    if (key in paar) {
      groups.push({
        group: true,
        columnKey: `paar_${key}`,
        columns: paar[key].
          map(({ element, effect }) => createAdvancedViewColumn(
            { key: element, label: element, effect }, 'paar', profiles
          )),
        getLabel: () => getLabel(key),
        headerClasses: 'wgsa-table-header--expanded',
        headerTitle: fullName,
        onHeaderClick,
      });
    }
    return groups;
  }, []);
}
