import { getGenomeIdsInPath } from './selectors';

import { actions } from '../../map';
import { activateFilter, resetFilter } from '../filter/actions';

import { filterKeys } from '../filter/constants';

export function filterByLassoPath(stateKey, path) {
  return (dispatch, getState) => {
    dispatch(actions.changeLassoPath(stateKey, path));
    if (path) {
      const genomeIds = getGenomeIdsInPath(getState(), { stateKey });
      dispatch(activateFilter(genomeIds, filterKeys.MAP));
    } else {
      dispatch(resetFilter(filterKeys.MAP));
    }
  };
}
