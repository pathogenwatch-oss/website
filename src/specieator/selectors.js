import { createSelector } from 'reselect';

export const getFastas = ({ entities }) => entities.fastas;

export const getFastaOrder = ({ specieator }) => specieator.fastaOrder;
export const getFilter = ({ specieator }) => specieator.filter;

export const isFilterActive = createSelector(
  getFilter,
  filter => filter.active
);

export const getFastasAsList = createSelector(
  getFastas,
  fastas => Object.keys(fastas).map(key => fastas[key])
);

export const getTotalFastas = (state) => getFastasAsList(state).length;

export const getOrderedFastas =
  createSelector(
    getFastas,
    getFastaOrder,
    (fastas, order) => order.map(name => fastas[name])
  );

export const getVisibleFastas = createSelector(
  getOrderedFastas,
  getFilter,
  (fastas, { active, ids, speciesId }) => {
    if (active) {
      return fastas.filter(fasta =>
        (ids.size ? ids.has(fasta.name) : true) &&
        (speciesId ? speciesId === fasta.speciesId : true)
      );
    }
    return fastas;
  }
);

export const getSpeciesSummary = createSelector(
  getOrderedFastas,
  getFilter,
  (fastas, filterState) => Array.from(
    fastas.reduce((memo, { speciesId }) => {
      if (!speciesId) return memo;

      const { count = 0 } = memo.get(speciesId) || {};

      memo.set(speciesId, {
        speciesId,
        count: count + 1,
        active: speciesId === filterState.speciesId,
      });

      return memo;
    }, new Map()).values()
  )
);
