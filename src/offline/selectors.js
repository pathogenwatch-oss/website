export const getOffline = state => state.offline;

export function getStatus(state) {
  return getOffline(state).status;
}

export function getCollections(state) {
  return getOffline(state).collections;
}
