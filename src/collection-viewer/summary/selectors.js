import { createSelector } from 'reselect';

import { getViewer } from '../../collection-route/selectors';

import {
  getActiveAssemblies,
  getColourGetter,
} from '../selectors';

export const getColouredActiveAssemblies = createSelector(
  getActiveAssemblies,
  getColourGetter,
  (items, colourGetter) =>
    items.map((assembly) => ({
      assembly,
      colour: colourGetter(assembly),
    })
  )
);

export const getAssemblySummary = createSelector(
  getActiveAssemblies,
  getColourGetter,
  (activeAssemblies, colourGetter) => Array.from(
    activeAssemblies.reduce((memo, assembly) => {
      const colour = colourGetter(assembly);
      const assemblies = memo.get(colour) || [];
      assemblies.push(assembly);
      return memo.set(colour, assemblies);
    }, new Map()).entries()
  )
);

const getSummary = state => getViewer(state).summary;

export const getIsSummaryExpanded = (state) => getSummary(state).isExpanded;
