export * from './filter';

export const prefilters = {
  all(genome) {
    return !genome.binned;
  },
  user(genome) {
    return !genome.binned && genome.owner === 'me';
  },
  upload(genome) {
    return !genome.binned && genome.uploaded;
  },
  bin(genome) {
    return genome.binned;
  },
};

export default from './Filter.react';
