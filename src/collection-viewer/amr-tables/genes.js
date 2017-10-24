const { onHeaderClick } = require('./thunks');

import { tableKeys } from '../constants';
import { createAdvancedViewColumn, getAntibioticLabel } from './utils';
import Organisms from '../../organisms';

function applyPaarOverrides(paar) {
  const { paarOverrides = [] } = Organisms.current.amrOptions || {};

  for (const { gene, from, to } of paarOverrides) {
    if (!(from in paar)) continue;
    const geneDef = paar[from].find(_ => _.element === gene);
    if (!geneDef) continue;

    const fromGenes = new Set(paar[from]);
    fromGenes.delete(geneDef);
    paar[from] = Array.from(fromGenes);

    paar[to] = paar[to].concat(geneDef);
  }
}

export const name = tableKeys.genes;

export function buildColumns({ paar, antibiotics }, profiles) {
  applyPaarOverrides(paar);

  return antibiotics.reduce((groups, antibiotic) => {
    const { key, fullName } = antibiotic;

    if (key in paar) {
      groups.push({
        group: true,
        columnKey: `paar_${key}`,
        label: getAntibioticLabel(antibiotic),
        headerClasses: 'wgsa-table-header--expanded',
        headerTitle: fullName,
        onHeaderClick,
        columns: paar[key]
        .map(({ element, effect }) => createAdvancedViewColumn(
          { key: element, label: element, effect }, 'paar', profiles
        )),
      });
    }
    return groups;
  }, []);
}
