export const promiseToThunk = () => next => action => {
  const { type, payload: { promise, ...props } = {} } = action;

  if (!promise || !promise.then) {
    return next(action);
  }

  return next(dispatch => {
    dispatch({ type: type.ATTEMPT, payload: { ...props } });
    return promise.then(
      result =>
        dispatch({ type: type.SUCCESS, payload: { result, ...props } }),
      error => {
        if (process.env.NODE_ENV !== 'production') { console.error(error); }
        dispatch({ type: type.FAILURE, payload: { error, ...props } });
        return error;
      }
    );
  });
};
