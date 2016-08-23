import { CREATE_COLLECTION } from '../specieator/actions';
import { FETCH_ENTITIES, CHECK_STATUS, UPDATE_PROGRESS } from '../actions/fetch';
import { SET_COLLECTION_ID } from '../actions/collection';
import { SET_TREE } from '../actions/tree';

import { sortAssemblies } from '../constants/table';
import { statuses } from '../constants/collection';

function replaceSubtypeAssemblyNames(uploaded, reference) {
  return Object.keys(uploaded)
    .reduce(function (memo, assemblyId) {
      const { populationSubtype, ...assembly } = uploaded[assemblyId];
      memo[assemblyId] = {
        ...assembly,
        populationSubtype:
          reference[populationSubtype].originalAssemblyName,
      };
      return memo;
    }, {}
  );
}

function decorateReferenceAssemblies(assemblies) {
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
        originalAssemblyName: metadata.assemblyName,
        __isReference: true,
      };
      return memo;
    }, {}
  );
}

function decorateCollectionAssemblies(assemblies) {
  return Object.keys(assemblies).reduce(function (memo, key) {
    memo[key] = {
      ...assemblies[key],
      __isCollection: true,
    };
    return memo;
  }, {});
}

function decoratePublicAssemblies(assemblies) {
  return Object.keys(assemblies).reduce(function (memo, key) {
    memo[key] = {
      ...assemblies[key],
      __isPublic: true,
    };
    return memo;
  }, {});
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
        const uploadedAssemblies =
          decorateCollectionAssemblies(uploaded.assemblies);
        const referenceAssemblies =
          decorateReferenceAssemblies(reference.assemblies);
        return {
          ...replaceSubtypeAssemblyNames(uploadedAssemblies, referenceAssemblies),
          ...referenceAssemblies,
        };
      }
    },
    [SET_TREE]: function (state, { ready, result }) {
      if (ready && result) {
        const publicAssemblies = decoratePublicAssemblies(result.assemblies);
        return {
          ...state,
          ...replaceSubtypeAssemblyNames(publicAssemblies, state),
        };
      }
      return state;
    },
  },

};

export const collection = {
  initialState: { id: null, assemblyIds: [] },
  actions: {
    [CREATE_COLLECTION](state, { ready, result, speciesId }) {
      if (!ready || !result) return state;

      return {
        ...state,
        id: result && result.collectionId,
        speciesId,
      };
    },
    [SET_COLLECTION_ID]: function (state, { id }) {
      return {
        ...state,
        id,
      };
    },
    [CHECK_STATUS]: function (state, { ready, result, error }) {
      if (ready && error) {
        return {
          ...state,
          status: statuses.NOT_FOUND,
        };
      }

      if (ready) {
        return {
          ...state,
          ...result,
        };
      }

      return state;
    },
    [UPDATE_PROGRESS]: function (state, { results }) {
      return {
        ...state,
        ...results,
      };
    },
    [FETCH_ENTITIES]: function (state, { ready, result, error }) {
      if (ready && error) {
        return {
          ...state,
          status: statuses.NOT_FOUND,
        };
      }

      if (result) {
        const [ uploaded ] = result;
        return {
          ...state,
          status: statuses.FETCHED,
          assemblyIds: new Set(
            Object.keys(uploaded.assemblies).sort(
              sortAssemblies.bind(null, uploaded.assemblies)
            )
          ),
          subtrees: uploaded.subtrees,
        };
      }

      return state;
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
          assemblyIds: new Set(Object.keys(referenceCollection.assemblies)),
        };
      }
    },
  },
};
