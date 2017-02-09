export * from './filter';

export * as selectors from './selectors';

export const prefilters = {
  all(collection) {
    return !collection.binned;
  },
  user(collection) {
    return !collection.binned && collection.owner === 'me';
  },
  bin(collection) {
    return collection.binned;
  },
};

export default from './Filter.react';
