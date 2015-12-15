import { FETCH_ENTITIES } from '../actions/fetch';
import { SET_COLLECTION_ID } from '../actions/collection';
import { SET_TREE } from '../actions/tree';

import { sortAssemblies } from '../constants/table';

function replaceSubtypeDisplayNames(uploaded, reference) {
  return Object.keys(uploaded)
    .reduce(function (memo, assemblyId) {
      const { populationSubtype, ...assembly } = uploaded[assemblyId];
      memo[assemblyId] = {
        ...assembly,
        populationSubtype:
          reference[populationSubtype].metadata.assemblyName,
      };
      return memo;
    }, {}
  );
}

function addReferenceSTSuffixes(assemblies) {
  return Object.keys(assemblies)
    .reduce(function (memo, assemblyId) {
      const { metadata, analysis, ...assembly } = assemblies[assemblyId];
      memo[assemblyId] = {
        ...assembly,
        analysis,
        metadata: {
          ...metadata,
          assemblyName: analysis ?
            `${metadata.assemblyName}_ST${analysis.st}` :
            metadata.assemblyName,
        },
      };
      return memo;
    }, {}
  );
}

export const assemblies = {
  initialState: {},
  actions: {
    [FETCH_ENTITIES]: function (state, { ready, result, error }) {
      if (!ready || error) {
        return state;
      }

      if (result) {
        const [ uploaded, reference ] = result;
        return {
          ...replaceSubtypeDisplayNames(uploaded.assemblies, reference.assemblies),
          ...addReferenceSTSuffixes(reference.assemblies),
        };
      }
    },
    [SET_TREE]: function (state, { ready, result }) {
      if (ready && result) {
        return {
          ...state,
          ...result.assemblies,
        };
      }
      return state;
    },
  },

};

export const collection = {
  initialState: { id: null, assemblyIds: [] },
  actions: {
    [SET_COLLECTION_ID]: function (state, { id }) {
      return {
        ...state,
        id,
      };
    },
    [FETCH_ENTITIES]: function (state, { ready, result, error }) {
      if (!ready || error) {
        return state;
      }

      if (result) {
        const [ uploaded ] = result;
        return {
          ...state,
          assemblyIds:
            Object.keys(uploaded.assemblies).sort(
              sortAssemblies.bind(null, uploaded.assemblies)
            ),
          subtrees: uploaded.subtrees,
        };
      }
    },
  },
};

export const reference = {
  initialState: { assemblyIds: [] },
  actions: {
    [FETCH_ENTITIES]: function (state, { ready, result, error }) {
      if (!ready || error) {
        return state;
      }

      if (result) {
        const [ , referenceCollection ] = result;
        return {
          ...state,
          assemblyIds: Object.keys(referenceCollection.assemblies),
        };
      }
    },
  },
};
