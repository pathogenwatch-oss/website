import { createSelector } from 'reselect';

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
    return true;
  }
);

export const getSpeciesSummary = createSelector(
  getOrderedFastas,
  getFilter,
  (fastas, filterState) => Array.from(
    fastas.reduce((memo, { supported, speciesKey, speciesLabel }) => {
      if (!speciesKey) return memo;

      const { count = 0 } = memo.get(speciesKey) || {};

      memo.set(speciesKey, {
        supported,
        name: speciesKey,
        label: speciesLabel,
        count: count + 1,
        active: speciesKey === filterState.speciesKey,
      });

      return memo;
    }, new Map()).values()
  )
);
