export const LIBMR_HISTORY_SNAPSHOT = 'LIBMR HISTORY SNAPSHOT';

export function snapshot(image) {
  return {
    type: LIBMR_HISTORY_SNAPSHOT,
    payload: {
      image,
    },
  };
}

export const LIBMR_HISTORY_TRAVEL = 'LIBMR HISTORY TRAVEL';

export function travel(index) {
  return {
    type: LIBMR_HISTORY_TRAVEL,
    payload: {
      index,
    },
  };
}
export const LIBMR_HISTORY_REVERT = 'LIBMR HISTORY REVERT';

export function revert() {
  return {
    type: LIBMR_HISTORY_REVERT,
  };
}
