export const readyStatePromise = () => next => action => {
  if (!action.promise) {
    return next(action);
  }

  function makeAction(ready, data) {
    const newAction = Object.assign({}, action, { ready }, data);
    delete newAction.promise;
    return newAction;
  }

  next(makeAction(false));

  return action.promise.then(
    result => next(makeAction(true, { result })),
    error => next(makeAction(true, { error }))
  );
};
