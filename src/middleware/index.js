export const promiseToThunk = () => next => action => {
  if (!action.promise) {
    return next(action);
  }

  const { type, promise } = action;

  return next(dispatch => {
    dispatch({ type: type.ATTEMPT });
    return promise.then(
      result => dispatch({ type: type.SUCCESS, payload: result }),
      error => dispatch({ type: type.ERROR, payload: error })
    );
  });
};
