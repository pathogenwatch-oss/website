import { measureText } from '../../table/utils/columnWidth';
import { createAdvancedViewColumn } from './utils';
import * as resistanceProfile from '../../utils/resistanceProfile';

import { tableKeys } from '../../collection-viewer/table/constants';

export const name = tableKeys.snps;

export function buildColumns({ snp, antibiotics }, profiles) {
  return Object.keys(snp).
    map(antibiotic => ({
      group: true,
      columnKey: `snp_${antibiotic}`,
      columns:
        Object.keys(snp[antibiotic]).
          reduce((columns, gene) =>
            columns.concat({
              cellClasses: 'wgsa-table-cell--resistance',
              columnKey: gene,
              fixedWidth: measureText(gene, true) + 16,
              flexGrow: 0,
              getCellContents() {},
              getHeaderContent: () => `${gene}_`,
              addState({ data }) {
                this.hidden =
                  snp[antibiotic][gene].every(snpName =>
                    data.every(
                      ({ analysis }) =>
                        analysis.resistanceProfile.snp.indexOf(`${gene}_${snpName}`) === -1
                    )
                  );
                return this;
              },
              headerClasses: 'wgsa-table-header--expanded',
            },
            snp[antibiotic][gene].
              map(snpName => createAdvancedViewColumn(
                { key: `${gene}_${snpName}`, label: snpName }, 'snp', profiles,
              ))
            ), []),
      getLabel: () => antibiotic,
      headerClasses: 'wgsa-table-header--expanded wgsa-table-header--group',
      headerTitle: antibiotics.find(_ => _.key === antibiotic).fullName,
      onHeaderClick: resistanceProfile.onHeaderClick,
    }));
}
