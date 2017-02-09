export * from './filter';

export const prefilters = {
  all(genome) {
    return !genome.binned;
  },
  user(genome) {
    return genome.owner === 'me';
  },
  upload(genome) {
    return genome.uploaded;
  },
  bin(genome) {
    return genome.binned;
  },
};

export default from './Filter.react';
