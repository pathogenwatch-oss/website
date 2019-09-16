import { createSelector } from 'reselect';

import { getGenomeList } from '../genomes/selectors';
import {
  getTableState,
  getAMRTableName,
  getActiveDataTable,
} from '../table/selectors';

import { createColourGetter } from '../amr-utils';

const getColourGetter = createSelector(
  getTableState,
  getAMRTableName,
  (tables, name) => createColourGetter(tables.entities[name], tables.multi)
);

const getLabelGetter = createSelector(
  getActiveDataTable,
  activeTable => activeTable.activeColumn.valueGetter
);

function getShape(genome) {
  if (genome.reference) return 'triangle';
  if (genome.public) return 'square';
  return 'circle';
}

export const getGenomeStyles = createSelector(
  getGenomeList,
  getLabelGetter,
  getColourGetter,
  (genomes, getLabel, getColour) => {
    const styles = {};
    for (const genome of genomes) {
      styles[genome.id] = {
        colour: getColour(genome),
        label: getLabel(genome),
        shape: getShape(genome),
      };
    }
    return styles;
  }
);
