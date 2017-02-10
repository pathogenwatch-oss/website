export const PREFILTER = 'PREFILTER';

export function prefilter(stateKey, name) {
  return {
    type: PREFILTER,
    payload: {
      stateKey,
      name,
    },
  };
}
