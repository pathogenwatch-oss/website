/* eslint-disable no-param-reassign */
import { cloneDeep } from 'lodash';

export const ignoreFields = new Set([ 'GPA', 'MAC', 'OMPK', 'RIF', 'SHVM' ]);
export const multiClassFields = { BLA: 'BLI', EBL: 'EBI', CBP: 'OMPK' };

export function sortKleborateProfile() {
  return (a, b) => ((a.name > b.name) ? 1 : -1);
}

export function displayAMRField({ key }) {
  return !ignoreFields.has(key);
}

export function formatAMRName({ name }) {
  return name
    .replace('Third generation', '3rd gen.')
    .replace('with', '+')
    .replace('beta', 'β');
}

export function formatAMRMatch({ matches }) {
  return matches === '-' ?
    'None found' :
    matches
      .replace(/;/gi, ', ')
      .replace(/\^/gi, '')
      .replace(/\*\?/gi, ' (homolog, fragment)')
      .replace(/\*/gi, ' (homolog)')
      .replace(/\?/gi, ' (fragment)')
      .replace(/\.v\d/g, '');
}

// The information in the +inh columns needs to be duplicated into the -inh
// columns.
// e.g. Bla_ESBL_acquired’ and ‘Bla_ESBL_inhR_acquired
export function mergeColumnInto(to, from, profile) {
  if (profile[to].matches === '-' && profile[from].matches !== '-') {
    profile[to].matches = profile[from].matches;
    profile[to].resistant = true;
  } else if (profile[to].matches !== '-' && profile[from].matches !== '-') {
    profile[to].matches = `${profile[to].matches};${profile[from].matches}`;
    profile[to].resistant = true;
  }
}

export function mergeMatches(a, b, profile) {
  if (profile[a].matches === '-') {
    return profile[b].matches;
  } else if (profile[b].matches === '-') {
    return profile[a].matches;
  }
  return `${profile[a].matches};${profile[b].matches}`;
}

export function mergeInhibitorColumns(profile) {
  const updatedProfile = cloneDeep(profile);
  for (const to of Object.keys(multiClassFields)) {
    mergeColumnInto(to, multiClassFields[to], updatedProfile);
  }
  return updatedProfile;
}
