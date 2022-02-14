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
  // eslint-disable-next-line no-param-reassign
  if (profile[to].matches === '-') {
    return profile[from].matches;
  } else if (profile[from].matches === '-') {
    return profile[to].matches;
  }
  return `${profile[to].matches};${profile[from].matches}`;
}

export function mergeInhibitorColumns(profile) {
  for (const to of Object.keys(multiClassFields)) {
    mergeColumnInto(to, multiClassFields[to], profile);
  }
  return profile;
}
