export const getPrefilter =
  ({ prefilter }, { stateKey }) => prefilter[stateKey] || 'all';
