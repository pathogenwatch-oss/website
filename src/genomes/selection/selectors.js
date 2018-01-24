import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';

import { getGenomeList } from '../selectors';
import { getVisible } from '../summary/selectors';
import { getDeployedOrganismIds } from '../../summary/selectors';

import { isOverSelectionLimit } from './utils';

import { analysisLabels } from '../constants';

export const getSelection = ({ genomes }) => genomes.selection;
export const getSelectedGenomes = state => getSelection(state).genomes;
export const getSelectionDropdownView = state => getSelection(state).dropdown;
export const getSelectionDownloads = state => getSelection(state).download;
export const getLastSelectedIndex = state => getSelection(state).lastSelectedIndex;

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

export const getSelectionStatus = createSelector(
  getSelectedGenomeIds,
  getSelectedGenomes,
  getGenomeList,
  getVisible,
  (ids, selection, genomes, total) => {
    if (ids.length === 0) return 'UNCHECKED';
    if (genomes.length === total && genomes.every(({ id }) => (id in selection))) return 'CHECKED';
    return 'INDETERMINATE';
  }
);

export const getDownloadSummary = createSelector(
  getSelectionDownloads,
  ({ summary }) => {
    if (!summary) return [];

    return summary.map(item => {
      const allIds = new Set();
      const tasks = [];
      for (const { task, ids, sources } of item.tasks) {
        tasks.push({
          ids,
          sources,
          name: task,
          label: analysisLabels[task] || task,
        });
        for (const id of ids) {
          allIds.add(id);
        }
      }
      return {
        speciesId: item.speciesId,
        speciesName: item.speciesName,
        total: item.total,
        ids: Array.from(allIds),
        tasks: sortBy(tasks, _ => _.label.toUpperCase()),
      };
    });
  }
);
