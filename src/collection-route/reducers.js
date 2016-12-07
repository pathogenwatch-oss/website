import { CREATE_COLLECTION } from '../hub-drawer';
import * as actions from './actions';
import { FETCH_TREE } from '../collection-viewer/tree/actions';

import { sortAssemblies } from '../table/utils';
import { statuses } from '../collection-route/constants';

function createAnalysisDictionary(analyses = []) {
  return analyses.reduce((memo, { name, result }) => {
    memo[name.toLowerCase()] = result;
    return memo;
  });
}

function decorateReferenceAssemblies(assemblies) {
  return Object.keys(assemblies)
    .reduce((memo, assemblyId) => {
      const { analysis, ...assembly } = assemblies[assemblyId];
      memo[assemblyId] = {
        ...assembly,
        analysis: createAnalysisDictionary(analysis),
        __isReference: true,
      };
      return memo;
    }, {}
  );
}

function decorateCollectionAssemblies(assemblies) {
  return assemblies.reduce((memo, assembly) => {
    memo[assembly.uuid] = {
      ...assembly,
      analysis: createAnalysisDictionary(assembly.analysis),
      __isCollection: true,
    };
    return memo;
  }, {});
}

function decoratePublicAssemblies(assemblies) {
  return Object.keys(assemblies).reduce((memo, key) => {
    memo[key] = {
      ...assemblies[key],
      analysis: createAnalysisDictionary(assembly.analysis),
      __isPublic: true,
    };
    return memo;
  }, {});
}

export const assemblies = {
  initialState: {},
  actions: {
    [actions.FETCH_COLLECTION.SUCCESS](state, { result }) {
      return {
        ...state,
        ...decorateCollectionAssemblies(result.assemblies),
      };
    },
    [actions.FETCH_SPECIES_DATA.SUCCESS](state, { result: [ reference ] }) {
      return {
        ...state,
        ...decorateReferenceAssemblies(reference.assemblies),
      };
    },
    [FETCH_TREE.SUCCESS](state, { result }) {
      return {
        ...state,
        ...decoratePublicAssemblies(result.assemblies),
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
    [actions.FETCH_COLLECTION.FAILURE](state) {
      return {
        ...state,
        status: statuses.NOT_FOUND,
      };
    },
    [actions.FETCH_COLLECTION.SUCCESS](state, { result }) {
      return {
        ...state,
        assemblyIds: new Set(
          sortAssemblies(result.assemblies).map(_ => _.uuid),
        ),
        id: result.uuid,
        metadata: {
          title: result.title,
          description: result.description,
          dateCreated: new Date(result.progress.completed).toLocaleDateString(),
        },
        progress: result.progress,
        status: result.status,
        subtrees: result.subtrees,
      };
    },
    [actions.UPDATE_COLLECTION_PROGRESS](state, { progress }) {
      return {
        ...state,
        progress,
      };
    },
    [actions.FETCH_SPECIES_DATA.FAILURE](state) {
      return {
        ...state,
        status: statuses.NOT_FOUND,
      };
    },
  },
};

export const reference = {
  initialState: { assemblyIds: [] },
  actions: {
    [actions.FETCH_SPECIES_DATA.SUCCESS](state, { result: [ referenceData ] }) {
      return {
        ...state,
        assemblyIds: new Set(Object.keys(referenceData.assemblies)),
      };
    },
  },
};
