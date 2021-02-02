import { createSelector } from 'reselect';

import { taxIdMap } from '../organisms';

const getOrganisms = state => state.organisms;

const compareStrings = (a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};

export const getSupportedOrganisms = createSelector(
  getOrganisms,
  ({ supportedOrganisms }) => supportedOrganisms.sort(
    (a, b) => compareStrings(
      taxIdMap.get(a.organismId).name,
      taxIdMap.get(b.organismId).name
    )
  )
);

export const getAllSpecies = createSelector(
  getOrganisms,
  ({ allSpecies }) => allSpecies.sort(
    (a, b) => compareStrings(a.speciesName, b.speciesName)
  )
);
