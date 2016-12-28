import { getAssemblyIdsInPath } from './selectors';

import { actions } from '../../map';
import { activateFilter, resetFilter } from '../filter/actions';

export function filterByLassoPath(stateKey, path) {
  return (dispatch, getState) => {
    dispatch(actions.changeLassoPath(stateKey, path));
    if (path) {
      const assemblyIds = getAssemblyIdsInPath(getState(), { stateKey });
      dispatch(activateFilter(assemblyIds));
    } else {
      dispatch(resetFilter());
    }
  };
}
