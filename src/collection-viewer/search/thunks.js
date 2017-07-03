import { getItemAtCursor } from './selectors';
import { selectSearchItem } from './actions';

export function selectItemAtCursor() {
  return (dispatch, getState) => {
    const item = getItemAtCursor(getState());
    if (item) {
      dispatch(selectSearchItem(item));
    }
  };
}
