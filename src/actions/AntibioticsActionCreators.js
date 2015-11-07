import ApiUtils from '../utils/Api';

export const SET_ANTIBIOTICS = 'SET_ANTIBIOTICS';

export function fetchAntibiotics(speciesId) {
  return {
    type: SET_ANTIBIOTICS,
    promise: ApiUtils.getAntibiotics(null, speciesId),
  };
}
