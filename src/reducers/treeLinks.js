import { FETCH_ENTITIES } from '../actions/fetch';

const initialState = {};

const windowURL = window.URL || window.webkitURL;
function createBlobUrl(data, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([ data ], { type });
  return windowURL.createObjectURL(blob);
}

function getTreeWithPrettyTaxa({ tree, assemblies }) {
  return Object.keys(assemblies).reduce(function (prettyTree, assemblyId) {
    return prettyTree.replace(
      assemblyId, assemblies[assemblyId].metadata.assemblyName
    );
  }, tree);
}

const actions = {
  [FETCH_ENTITIES]: function (state, { ready, error, result }) {
    if (ready && !error) {
      const [ uploaded, reference ] = result;
      return {
        collection: createBlobUrl(getTreeWithPrettyTaxa(uploaded)),
        population: createBlobUrl(getTreeWithPrettyTaxa(reference)),
      };
    }

    return state;
  },
};

export default { initialState, actions };
