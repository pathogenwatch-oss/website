import { CREATE_COLLECTION } from '../specieator/actions';
import { FETCH_ENTITIES, CHECK_STATUS, UPDATE_PROGRESS } from '../actions/fetch';
import { SET_COLLECTION_ID } from '../actions/collection';
import { FETCH_TREE } from '../actions/tree';

import { sortAssemblies } from '../utils/table';
import { statuses } from '../constants/collection';

import Species from '^/species';

function replaceSubtypeAssemblyNames(uploaded, reference) {
  const { uiOptions = {} } = Species.current;
  if (uiOptions.noPopulation) {
    return uploaded;
  }
  return Object.keys(uploaded)
    .reduce((memo, assemblyId) => {
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
    .reduce((memo, assemblyId) => {
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
  return Object.keys(assemblies).reduce((memo, key) => {
    memo[key] = {
      ...assemblies[key],
      __isCollection: true,
    };
    return memo;
  }, {});
}

function decoratePublicAssemblies(assemblies) {
  return Object.keys(assemblies).reduce((memo, key) => {
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
    [FETCH_ENTITIES.SUCCESS](state, [ uploaded, reference ]) {
      const uploadedAssemblies =
        decorateCollectionAssemblies(uploaded.assemblies);
      const referenceAssemblies =
        decorateReferenceAssemblies(reference.assemblies);
      return {
        ...replaceSubtypeAssemblyNames(uploadedAssemblies, referenceAssemblies),
        ...referenceAssemblies,
      };
    },
    [FETCH_TREE.SUCCESS](state, { result }) {
      const publicAssemblies = decoratePublicAssemblies(result.assemblies);
      return {
        ...state,
        ...replaceSubtypeAssemblyNames(publicAssemblies, state),
      };
    },
  },

};

export const collection = {
  initialState: { id: null, assemblyIds: [] },
  actions: {
    [CREATE_COLLECTION.SUCCESS](state, { result, speciesId }) {
      return {
        ...state,
        id: result && result.collectionId,
        speciesId,
      };
    },
    [SET_COLLECTION_ID](state, { id }) {
      return {
        ...state,
        id,
      };
    },
    [CHECK_STATUS.FAILURE](state) {
      return {
        ...state,
        status: statuses.NOT_FOUND,
      };
    },
    [CHECK_STATUS.SUCCESS](state, result) {
      return {
        ...state,
        ...result,
      };
    },
    [UPDATE_PROGRESS](state, { results }) {
      return {
        ...state,
        ...results,
      };
    },
    [FETCH_ENTITIES.FAILURE](state) {
      return {
        ...state,
        status: statuses.NOT_FOUND,
      };
    },
    [FETCH_ENTITIES.SUCCESS](state, [ uploaded ]) {
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
    },
  },
};

export const reference = {
  initialState: { assemblyIds: [] },
  actions: {
    [FETCH_ENTITIES.SUCCESS](state, [ , referenceCollection ]) {
      return {
        ...state,
        assemblyIds: new Set(Object.keys(referenceCollection.assemblies)),
      };
    },
  },
};
