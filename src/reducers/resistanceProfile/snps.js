import { measureText } from '../../table/utils/columnWidth';
import { createAdvancedViewColumn, checkCustomLabels } from './utils';
import * as resistanceProfile from '../../utils/resistanceProfile';

import { tableKeys } from '../../collection-viewer/table/constants';

export const name = tableKeys.snps;

export function buildColumns({ snp, antibiotics }, profiles) {
  return antibiotics.reduce((groups, { key, fullName }) => {
    if (key in snp) {
      groups.push({
        group: true,
        columnKey: `snp_${key}`,
        columns:
          Object.keys(snp[key]).
            sort().
            reduce((cols, gene) =>
              cols.concat({
                cellClasses: 'wgsa-table-cell--resistance',
                columnKey: gene,
                fixedWidth: measureText(gene, true) + 16,
                flexGrow: 0,
                getCellContents() {},
                getLabel: () => `${gene}_`,
                addState({ data }) {
                  this.hidden =
                    snp[key][gene].every(snpName =>
                      data.every(
                        ({ analysis }) =>
                          analysis.resistanceProfile.snp.indexOf(`${gene}_${snpName}`) === -1
                      )
                    );
                  return this;
                },
                headerClasses: 'wgsa-table-header--unstyled',
              },
              snp[key][gene].
                map(snpName => createAdvancedViewColumn(
                  { key: `${gene}_${snpName}`, label: snpName }, 'snp', profiles,
                ))
              ), []),
        getLabel: () => checkCustomLabels(key),
        headerClasses: 'wgsa-table-header--expanded wgsa-table-header--group',
        headerTitle: fullName,
        onHeaderClick: resistanceProfile.onHeaderClick,
      });
    }
    return groups;
  }, []);
}
