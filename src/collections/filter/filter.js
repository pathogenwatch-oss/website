export { COLLECTION as stateKey } from '../../app/stateKeys/filter';

export const filters = [
  { key: 'searchRegExp',
    matches(collection, regexp) {
      return regexp ?
        regexp.test(collection.title) || regexp.test(collection.description) :
        true;
    },
  },
  { key: 'speciesId',
    queryKey: 'species',
    matches(collection, value) {
      return collection.speciesId === value;
    },
  },
  { key: 'owner',
    queryKey: 'owner',
    matches(collection, value) {
      return collection.owner === value;
    },
  },
];
