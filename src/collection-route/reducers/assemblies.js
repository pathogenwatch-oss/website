import * as actions from '../actions';
import { FETCH_TREE } from '../../collection-viewer/tree/actions';

function createAnalysisDictionary(analyses = []) {
  if (!Array.isArray(analyses)) return analyses;
  return analyses.reduce((memo, { name, result }) => {
    memo[name.toLowerCase()] = result;
    return memo;
  }, {});
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
  return assemblies.reduce((memo, assembly) => {
    memo[assembly.uuid] = {
      ...assembly,
      analysis: createAnalysisDictionary(assembly.analysis),
      __isPublic: true,
    };
    return memo;
  }, {});
}

export default function (state = {}, { type, payload }) {
  switch (type) {
    case actions.FETCH_COLLECTION.SUCCESS: {
      const { result } = payload;
      return {
        ...state,
        ...decorateCollectionAssemblies(result.genomes),
      };
    }
    case actions.FETCH_SPECIES_DATA.SUCCESS: {
      const { result: [ reference ] } = payload;
      return {
        ...state,
        ...decorateReferenceAssemblies(reference.assemblies),
      };
    }
    case FETCH_TREE.SUCCESS: {
      const { result } = payload;
      return {
        ...state,
        ...decoratePublicAssemblies(result.assemblies),
      };
    }
    default:
      return state;
  }
}
