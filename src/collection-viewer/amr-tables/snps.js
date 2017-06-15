const { onHeaderClick } = require('./thunks');

import { measureText } from '../table/columnWidth';
import { createAdvancedViewColumn, getAntibioticLabel } from './utils';

import { tableKeys } from '../constants';

export const name = tableKeys.snps;

export function buildColumns({ snp, antibiotics }, profiles) {
  return antibiotics.reduce((groups, antibiotic) => {
    const { key, fullName } = antibiotic;
    if (key in snp) {
      groups.push({
        group: true,
        columnKey: `snp_${key}`,
        label: getAntibioticLabel(antibiotic),
        onHeaderClick,
        headerClasses: 'wgsa-table-header--expanded',
        headerTitle: fullName,
        columns:
          Object.keys(snp[key])
            .sort()
            .reduce((columns, gene) =>
              columns.concat({
                cellClasses: 'wgsa-table-cell--resistance',
                columnKey: gene,
                fixedWidth: measureText(gene, true) + 8,
                flexGrow: 0,
                getCellContents() {},
                getLabel: () => `${gene}_`,
                addState({ data }) {
                  if (!data.length) return this;
                  this.hidden =
                    snp[key][gene].every(({ snpName }) =>
                      data.every(({ analysis }) =>
                        analysis.paarsnp &&
                        analysis.paarsnp.snp.indexOf(`${gene}_${snpName}`) === -1
                      )
                    );
                  return this;
                },
                headerClasses: 'wgsa-table-header--unstyled wgsa-table-header--expanded',
              },
              snp[key][gene]
                .map(({ snpName, effect }) => createAdvancedViewColumn(
                  { key: `${gene}_${snpName}`, label: snpName, effect },
                  'snp',
                  profiles,
                ))
              ), []),
      });
    }
    return groups;
  }, []);
}
