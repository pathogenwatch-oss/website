import { getHighlightedIds } from '../selectors';
import { setHighlight, clearHighlight } from '../highlight/actions';

export function onRowClick(genome) {
  return (dispatch, getState) => {
    const state = getState();
    const ids = getHighlightedIds(state);

    if (ids.size === 1 && ids.has(genome.uuid)) {
      dispatch(clearHighlight());
    } else {
      dispatch(setHighlight([ genome.uuid ]));
    }
  };
}
