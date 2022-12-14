import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';
import queryString from 'query-string';

import { getGenomeList } from '../selectors';
import { getVisible, getSummary } from '../summary/selectors';
import { getDeployedOrganismIds } from '../../summary/selectors';
import { getPrefilter } from '../filter/selectors';

import { isOverSelectionLimit } from './utils';
import { getServerPath } from '~/utils/Api';

import { analysisLabels } from '../../app/constants';

export const getSelection = ({ genomes }) => genomes.selection;
export const getSelectedGenomes = state => getSelection(state).genomes;
export const getSelectionDropdownView = state => getSelection(state).dropdown;
export const getSelectionDownloads = state => getSelection(state).download;
export const getLastSelectedIndex = state =>
  getSelection(state).lastSelectedIndex;

export const getSelectedGenomeIds = createSelector(
  getSelectedGenomes,
  getPrefilter,
  (selection, prefilter) => {
    const ids = Object.keys(selection);
    if (prefilter === 'bin') return ids.filter(id => selection[id].binned);
    return ids;
  }
);

export const getSelectedGenomeList = createSelector(
  getSelectedGenomes,
  getSelectedGenomeIds,
  (selection, ids) => ids.map(key => selection[key])
);

export const getSelectionSize = state => getSelectedGenomeList(state).length;

export const getSelectionStatus = createSelector(
  getSelectedGenomeIds,
  getGenomeList,
  getVisible,
  (selection, genomes, total) => {
    if (selection.length === 0) return 'UNCHECKED';
    if (
      genomes.length === total &&
      genomes.every(({ id }) => selection.indexOf(id) !== -1)
    ) {
      return 'CHECKED';
    }
    return 'INDETERMINATE';
  }
);

function getTaskLink(name, sources, item) {
  const link = getServerPath(`/download/analysis/${name}`);
  const queryParams = {};
  if (name === 'serotype') {
    queryParams.speciesId = item.speciesId;
  }
  if (name === 'mlst') {
    queryParams.filename = `mlst-${sources[0]}.csv`;
  }
  if (name === 'mlst2') {
    queryParams.filename = `mlst-${sources[0]}.csv`;
  }
  const query = queryString.stringify(queryParams);
  if (query) {
    return `${link}?${query}`;
  }
  return link;
}

export const getDownloadSummary = createSelector(
  getSelectionDownloads,
  ({ summary }) => {
    if (!summary) return [];

    return summary.map(item => {
      const allIds = new Set();
      const tasks = [];
      for (const { task, ids, sources } of item.tasks) {
        if (task === 'paarsnp') {
          tasks.push(
            {
              ids,
              sources,
              name: 'paarsnp',
              label: 'AMR antibiogram',
              link: getTaskLink('paarsnp'),
            },
            {
              ids,
              sources,
              name: 'paarsnp-snps-genes',
              label: 'AMR SNPs/genes',
              link: getTaskLink('paarsnp-snps-genes'),
            }
          );
        } else {
          tasks.push({
            ids,
            sources,
            name: task,
            label: analysisLabels[task] || task,
            link: getTaskLink(task, sources, item),
          });
        }
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

export const isSelectAllDisabled = createSelector(
  getSummary,
  getPrefilter,
  (summary, prefilter) =>
    prefilter === 'all' && summary.visible === summary.total
);
