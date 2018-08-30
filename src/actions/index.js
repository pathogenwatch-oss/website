import { STALE_RESULT } from '../middleware';

const asyncStages = [ 'ATTEMPT', 'SUCCESS', 'FAILURE' ];

export function createAsyncConstants(actionType) {
  return asyncStages.reduce((constants, stage) => ({
    ...constants,
    [stage]: `${actionType}::${stage}`,
  }), {});
}

export function checkStale(actionCreator, getState, selector) {
  const state = getState();
  const value = selector(state);

  const action = actionCreator(value);
  const { promise, ...payload } = action.payload;

  return {
    type: action.type,
    payload: {
      ...payload,
      promise: promise.then(result => {
        const updatedState = getState();
        const updatedValue = selector(updatedState);

        // out of sync, indicate stale
        if (value !== updatedValue) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('[REDUX] Stale Result', action.type, result);
          }
          return STALE_RESULT;
        }

        return result;
      }),
    },
  };
}
