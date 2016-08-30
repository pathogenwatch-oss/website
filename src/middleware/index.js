export const promiseToThunk = () => next => action => {
  const { type, payload: { promise, ...props } = {} } = action;

  if (!promise || !promise.then) {
    return next(action);
  }

  return next(dispatch => {
    dispatch({ type: type.ATTEMPT, payload: { ...props } });
    return promise.then(
      result =>
        dispatch({
          type: type.SUCCESS,
          payload: Object.keys(props).length ? { result, ...props } : result,
        }),
      error =>
        dispatch({
          type: type.FAILURE,
          payload: Object.keys(props).length ? { error, ...props } : error,
        })
    );
  });
};
