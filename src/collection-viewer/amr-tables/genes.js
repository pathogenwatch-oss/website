import { tableKeys } from '../../collection-viewer/table/constants';
import { createAdvancedViewColumn } from './utils';
import * as resistanceProfile from '../amr-utils';

export const name = tableKeys.genes;

export function buildColumns({ paar, antibiotics }, profiles) {
  return Object.keys(paar).
    map(antibiotic => ({
      group: true,
      columnKey: `paar_${antibiotic}`,
      columns: paar[antibiotic].
        map(element => createAdvancedViewColumn(
          { key: element, label: element }, 'paar', profiles
        )),
      getLabel: () => antibiotic,
      headerClasses: 'wgsa-table-header--expanded wgsa-table-header--group',
      headerTitle: antibiotics.find(_ => _.key === antibiotic).fullName,
      onHeaderClick: resistanceProfile.onHeaderClick,
    }));
}
