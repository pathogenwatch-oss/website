import { tableKeys } from '../../collection-viewer/table/constants';
import { createAdvancedViewColumn, checkCustomLabels } from './utils';
import * as resistanceProfile from '../../utils/resistanceProfile';

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
        onHeaderClick: resistanceProfile.onHeaderClick,
      });
    }
    return groups;
  }, []);
}
