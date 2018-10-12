/* global localforage */
import config from '../../app/config';

const storageKey = 'selected-genomes';

export function getSelectionLimit() {
  const { pagination = { max: 2500 } } = config;
  return pagination.max;
}

export function isOverSelectionLimit(amount) {
  const limit = getSelectionLimit();
  return amount > limit;
}

export function getStoredSelection() {
  return localforage.getItem(storageKey)
    .then(list => Object.values(list || {}));
}

export function setStoredSelection(genomes = []) {
  const selection = {};
  for (const { id, name, organismId, binned } of genomes) {
    selection[id] = { id, name, organismId, binned };
  }
  return localforage.setItem(storageKey, selection);
}

export function addToStoredSelection(genomes) {
  return (
    localforage.getItem(storageKey)
      .then(selection => {
        for (const { id, name, organismId, binned } of genomes) {
          selection[id] = { id, name, organismId, binned };
        }
        return localforage.setItem(storageKey, selection);
      })
  );
}

export function removeFromStoredSelection(genomes) {
  return (
    localforage.getItem(storageKey)
      .then(selection => {
        for (const { id } of genomes) {
          delete selection[id];
        }
        return localforage.setItem(storageKey, selection);
      })
  );
}
