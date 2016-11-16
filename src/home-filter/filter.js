export { HOME as stateKey } from '../app/stateKeys/filter';

export const filters = [
  { key: 'searchRegExp',
    matches(collection, regexp) {
      return regexp ?
        regexp.test(collection.title) || regexp.test(collection.description) :
        true;
    },
  },
  { key: 'species',
    queryKey: 'species',
    matches(collection, value) {
      return collection.species === value;
    },
  },
];
