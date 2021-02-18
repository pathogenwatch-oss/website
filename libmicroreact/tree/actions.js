export const setPhylocanvasState = (state) => ({
  type: 'LIBMR PHYLOCANVAS STATE',
  payload: state,
});

export const setLassoActive = (active) => ({
  type: 'LIBMR TREE LASSO',
  payload: {
    lasso: active,
  },
});

export const setTreeFilter = (ids, path) => ({
  type: 'LIBMR TREE FILTER',
  payload: { ids, path },
});
