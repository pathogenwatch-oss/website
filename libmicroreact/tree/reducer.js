import phylocanvas from '@cgps/phylocanvas';

import defaults from '../defaults';

const initialState = {
  ids: null,
  lasso: false,
  maxBlockLength: 160,
  maxFontSize: 64,
  maxNodeSize: 64,
  minBlockLength: 1,
  minFontSize: 1,
  minNodeSize: 1,
  path: null,
  subtreeIds: null,
  phylocanvas: {
    ...phylocanvas.defaults,
    fontSize: defaults.FONT_SIZE,
    fontFamily: defaults.FONT,
    metadata: {
      blockLength: 14,
      headerFontWeight: '500',
      showLabels: false,
      showHeaders: false,
    },
    nodeSize: defaults.NODE_SIZE,
    padding: 32,
    renderInternalLabels: false,
    renderLeafBorders: true,
    renderLeafLabels: false,
    styleInternalNodes: false,
    styleLeafNodes: true,
    styleNodeLines: false,
    type: 'rc',
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LIBMR PHYLOCANVAS STATE': {
      let ids = state.ids;
      let subtreeIds = state.subtreeIds;
      if (action.payload.rootId && action.payload.rootId !== state.phylocanvas.rootId) {
        subtreeIds = action.payload.ids;
        ids = null;
      } else if (Array.isArray(action.payload.ids)) {
        ids = action.payload.ids;
      }
      if (action.payload.rootId === null && state.phylocanvas.rootId) {
        ids = null;
        subtreeIds = null;
      }
      return {
        ...state,
        ids,
        subtreeIds,
        phylocanvas: {
          ...state.phylocanvas,
          ...action.payload,
          metadata: {
            ...state.phylocanvas.metadata,
            ...(action.payload.metadata || {}),
          },
        },
      };
    }

    case 'LIBMR TREE FILTER': {
      return {
        ...state,
        ids: action.payload.ids || null,
        path: (action.payload && action.payload.path !== undefined) ?
          action.payload.path :
          state.path,
      };
    }

    case 'LIBMR TREE LASSO': {
      return {
        ...state,
        lasso: action.payload.lasso,
        ids: action.payload.lasso === false ? null : state.ids,
        path: action.payload.lasso === false ? null : state.path,
      };
    }

    default:
      return state;
  }
};

export default reducer;
