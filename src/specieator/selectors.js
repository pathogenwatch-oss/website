import { createSelector } from 'reselect';

import { isSupported } from '../species';

export const getFastas = ({ entities }) => entities.fastas;

export const getFastaOrder = ({ specieator }) => specieator.fastaOrder;
export const getFilter = ({ specieator }) => specieator.filter;

export const isFilterActive = createSelector(
  getFilter,
  ({ searchText = '', speciesKey }) =>
    searchText.length > 0 || speciesKey !== null
);

export const getFastasAsList = createSelector(
  getFastas,
  fastas => Object.keys(fastas).map(key => fastas[key])
);

export const getFastaKeys = createSelector(
  getFastasAsList,
  fastas => fastas.map(_ => _.name)
);

export const getTotalFastas = (state) => getFastasAsList(state).length;

export const getOrderedFastas =
  createSelector(
    getFastas,
    getFastaOrder,
    (fastas, order) => order.map(name => fastas[name])
  );

export const getVisibleFastas = createSelector(
  isFilterActive,
  getFilter,
  getOrderedFastas,
  (isActive, { searchText = '', speciesKey }, fastas) => {
    if (isActive) {
      const regexp = new RegExp(searchText, 'i');
      return fastas.filter(fasta =>
        (searchText.length ? regexp.test(fasta.name) : true) &&
        (speciesKey ? speciesKey === fasta.speciesKey : true)
      );
    }
    return fastas;
  }
);

export const isSupportedSpeciesSelected = createSelector(
  getVisibleFastas,
  fastas => {
    for (const { speciesId } of fastas) {
      if (!speciesId) return false;
      if (speciesId !== fastas[0].speciesId) return false;
    }
    return fastas.length > 0;
  }
);

export const getSpeciesSummary = createSelector(
  getOrderedFastas,
  getFilter,
  (fastas, filterState) => Array.from(
    fastas.reduce((memo, fasta) => {
      const { speciesKey, speciesLabel } = fasta;
      if (!speciesKey) return memo;

      const summary = memo.get(speciesKey) || {
        count: 0,
        name: speciesKey,
        label: speciesLabel,
        active: speciesKey === filterState.speciesKey,
        supported: isSupported(fasta),
      };

      summary.count++;

      memo.set(speciesKey, summary);

      return memo;
    }, new Map()).values()
  )
);
