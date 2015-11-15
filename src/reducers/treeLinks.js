import { FETCH_ENTITIES } from '../actions/fetch';

const initialState = {};

const windowURL = window.URL || window.webkitURL;
function createBlobUrl(data, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([ data ], { type });
  return windowURL.createObjectURL(blob);
}

const actions = {
  [FETCH_ENTITIES]: function (state, { ready, error, result }) {
    if (ready && !error) {
      const [ uploaded, reference ] = result;
      return {
        collection: createBlobUrl(uploaded.tree),
        population: createBlobUrl(reference.tree),
      };
    }

    return state;
  },
};

export default { initialState, actions };
