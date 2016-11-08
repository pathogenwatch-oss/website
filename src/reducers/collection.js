import { CREATE_COLLECTION } from '../hub-drawer';
import { FETCH_ENTITIES, CHECK_STATUS, UPDATE_PROGRESS } from '../actions/fetch';
import { SET_COLLECTION_ID } from '../actions/collection';
import { FETCH_TREE } from '../actions/tree';

import { sortAssemblies } from '../table/utils';
import { statuses } from '../collection-route/constants';

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
    [FETCH_ENTITIES.SUCCESS](state, { result: [ uploaded, reference ] }) {
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
  initialState: { id: null, assemblyIds: [], metadata: {} },
  actions: {
    [CREATE_COLLECTION.SUCCESS](state, { result, speciesId, metadata }) {
      return {
        ...state,
        id: result && result.collectionId,
        speciesId,
        metadata,
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
    [CHECK_STATUS.SUCCESS](state, { result }) {
      return {
        ...state,
        ...result,
      };
    },
    [UPDATE_PROGRESS](state, { result }) {
      return {
        ...state,
        ...result,
      };
    },
    [FETCH_ENTITIES.FAILURE](state) {
      return {
        ...state,
        status: statuses.NOT_FOUND,
      };
    },
    [FETCH_ENTITIES.SUCCESS](state, { result: [ uploaded ] }) {
      return {
        ...state,
        metadata: {
          title: uploaded.title,
          description: uploaded.description,
          dateCreated: new Date(uploaded.dateCreated).toLocaleDateString(),
        },
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
    [FETCH_ENTITIES.SUCCESS](state, { result: [ , referenceCollection ] }) {
      return {
        ...state,
        assemblyIds: new Set(Object.keys(referenceCollection.assemblies)),
      };
    },
  },
};
