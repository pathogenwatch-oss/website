export const promiseToThunk = () => next => action => {
  const { type, payload } = action;

  if (!payload || !payload.promise || !payload.promise.then) {
    return next(action);
  }

  const { promise, ...props } = payload;

  return next(dispatch => {
    dispatch({ type: type.ATTEMPT, payload: { ...props } });
    return promise.then(
      result => {
        dispatch({ type: type.SUCCESS, payload: { result, ...props } });
        return result;
      },
      error => {
        if (process.env.NODE_ENV !== 'production') { console.error(error); }
        dispatch({ type: type.FAILURE, payload: { error, ...props } });
        return error;
      }
    );
  });
};
