import { createSelector } from 'reselect';

import { getFilter, getColourGetter } from '../selectors';

import { titles, speciesTrees, leafStyles } from './constants';
import * as utils from './utils';

import { POPULATION, COLLECTION } from '../../app/stateKeys/tree';
import Species from '../../species';
import { CGPS } from '../../app/constants';

const getTreeState = ({ collectionViewer }) => collectionViewer.tree;

export const getTrees = state => getTreeState(state).entities;
export const isLoading = state => getTreeState(state).loading;

export const getLeafIds = (state, { stateKey }) =>
  getTrees(state)[stateKey].leafIds;

export const getVisibleTree = createSelector(
  getTreeState,
  ({ visible, entities }) => {
    const visibleTree = entities[visible];
    return visibleTree.newick ? visibleTree : entities[POPULATION];
  }
);

export const isLoaded = state => getVisibleTree(state).loaded;
export const getTreeType = state => getVisibleTree(state).type;
export const getBaseSize = state => getVisibleTree(state).baseSize;
export const getTreeScales = state => getVisibleTree(state).scales;

export const getSingleTree = createSelector(
  getTrees,
  trees => {
    const collectionTree = trees[COLLECTION];
    if (Species.uiOptions.noPopulation) return COLLECTION;
    if (!(collectionTree && collectionTree.newick)) return POPULATION;
    return null;
  }
);

export const getTitle = createSelector(
  getVisibleTree,
  ({ entities }) => entities.assemblies,
  ({ name }, assemblies) =>
    titles[name] || assemblies[name].metadata.assemblyName
);

export const getFilenames = createSelector(
  getTitle,
  ({ collection }) => collection.id,
  ({ tables }) => tables.metadata.activeColumn,
  utils.getFilenames
);

export const isSubtree = createSelector(
  getVisibleTree,
  tree => !speciesTrees.has(tree.name)
);

export const getPopulationTreeLeafProps = createSelector(
  state => getTrees(state)[POPULATION],
  ({ entities }) => entities.assemblies,
  ({ collection }) => collection.subtrees,
  getFilter,
  ({ leafIds }, assemblies, subtrees, { active, ids }) =>
    leafIds.reduce((props, leafId) => {
      const assembly = assemblies[leafId];
      const subtree = subtrees[leafId];
      const { assemblyIds = [], publicCount = 0 } = subtree || {};
      props[leafId] = {
        display: subtrees[leafId] ? leafStyles.subtree : leafStyles.reference,
        colour: subtree ? CGPS.COLOURS.PURPLE_LIGHT : CGPS.COLOURS.GREY,
        label: `${assembly.metadata.assemblyName} (${assemblyIds.length}) [${publicCount}]`,
        highlighted: (active && assemblyIds.some(id => ids.has(id))),
        interactive: !!subtree,
      };
      return props;
    }, {})
);

export const getStandardLeafProps = createSelector(
  getVisibleTree,
  ({ entities }) => entities.assemblies,
  getColourGetter,
  ({ tables }) => tables.metadata.activeColumn.valueGetter,
  getFilter,
  ({ leafIds }, assemblies, getColour, getLabel, { active, ids }) =>
    leafIds.reduce((props, id) => {
      const assembly = assemblies[id];
      props[id] = {
        display: utils.getLeafStyle(assembly),
        colour: getColour(assembly),
        label: getLabel(assembly),
        highlighted: active && ids.has(id),
      };
      return props;
    }, {})
);

export const getLeafProps = state => {
  const { name, loaded } = getVisibleTree(state);
  if (!loaded) return {};

  return (
    (name === POPULATION) ?
      getPopulationTreeLeafProps(state) :
      getStandardLeafProps(state)
  );
};
