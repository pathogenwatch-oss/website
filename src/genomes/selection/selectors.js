import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { getGenomeList } from '../selectors';
import { getDeployedOrganismIds } from '../../summary/selectors';

import { isOverSelectionLimit } from './utils';

import { analysisLabels } from '../constants';

export const getSelection = ({ genomes }) => genomes.selection;
export const getSelectedGenomes = state => getSelection(state).genomes;
export const getSelectionDropdownView = state => getSelection(state).dropdown;
export const getSelectionDownloads = state => getSelection(state).download;

export const getSelectedGenomeIds = createSelector(
  getSelectedGenomes,
  selection => Object.keys(selection)
);

export const getSelectedGenomeList = createSelector(
  getSelectedGenomes,
  getSelectedGenomeIds,
  (selection, ids) => ids.map(key => selection[key])
);

export const getSelectionSize = state => getSelectedGenomeList(state).length;

export const getSelectedSupportedGenomesList = createSelector(
  getSelectedGenomeList,
  getDeployedOrganismIds,
  (genomes, deployedIds) =>
    genomes.filter(genome => deployedIds.has(genome.organismId))
);

export const isSelectionLimitReached = createSelector(
  getSelectedGenomeIds,
  ids => isOverSelectionLimit(ids.length)
);

export const areAllSelected = createSelector(
  getSelectedGenomes,
  getGenomeList,
  (selection, genomes) => genomes.every(({ id }) => (id in selection))
);

export const getDownloadSummary = createSelector(
  getSelectionDownloads,
  ({ summary }) => {
    if (!summary) return [];

    return Object.keys(summary).map(key => {
      const item = summary[key];
      const ids = new Set();
      const tasks = [];
      for (const name of Object.keys(item.tasks)) {
        tasks.push({
          name,
          label: analysisLabels[name],
          ids: item.tasks[name],
        });
        for (const id of item.tasks[name]) {
          ids.add(id);
        }
      }
      return {
        ...item,
        ids: Array.from(ids),
        tasks: sortBy(tasks, 'label'),
      };
    });
  }
);
