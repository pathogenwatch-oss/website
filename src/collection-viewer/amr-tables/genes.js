const { onHeaderClick } = require('./thunks');

import { tableKeys } from '../table/constants';
import { createAdvancedViewColumn, checkCustomLabels } from './utils';

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
        getLabel: () => checkCustomLabels(key),
        headerClasses: 'wgsa-table-header--expanded wgsa-table-header--group',
        headerTitle: fullName,
        onHeaderClick,
      });
    }
    return groups;
  }, []);
}
