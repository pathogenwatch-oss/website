import { createSelector } from 'reselect';

import { taxIdMap } from '../organisms';

const getOrganisms = state => state.organisms;

const compareStrings = (a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};

export const getWgsaOrganisms = createSelector(
  getOrganisms,
  ({ wgsaOrganisms }) => wgsaOrganisms.sort(
    (a, b) => compareStrings(
      taxIdMap.get(a.organismId).name,
      taxIdMap.get(b.organismId).name
    )
  )
);

export const getOtherOrganisms = createSelector(
  getOrganisms,
  ({ otherOrganisms }) => {
    window.otherOrganisms = otherOrganisms;
    return otherOrganisms.sort(
      (a, b) => compareStrings(a.organismName, b.organismName)
    );
  }
);
