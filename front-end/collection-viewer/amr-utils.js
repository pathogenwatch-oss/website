import { CGPS, DEFAULT } from '../app/constants';
import { mergeMatches, multiClassFields } from '~/task-utils/kleborate';

const stateColours = {
  RESISTANT: DEFAULT.DANGER_COLOUR,
  INDUCIBLE: '#E68D44',
  INTERMEDIATE: DEFAULT.WARNING_COLOUR,
};

const effectColours = {
  RESISTANCE: DEFAULT.DANGER_COLOUR,
  CONTRIBUTES: DEFAULT.WARNING_COLOUR,
  INDUCED: '#E68D44',
  REDUCES: '#008080',
}

export const nonResistantColour = '#fff';
const stateColourMap = Object.keys(stateColours).reduce(
  (map, key) => map.set(stateColours[key], key),
  new Map([
    [ nonResistantColour, 'UNKNOWN' ],
  ])
);
export const getColourState = colour => stateColourMap.get(colour);

export function getStateColour(state) {
  return stateColours[state] || stateColours.RESISTANT;
}

// This would be better in CSS.
export function formatEffect(effect) {
  return effect.charAt(0) + effect.toLowerCase().slice(1);
}

export function getEffectColour(effect) {
  return effectColours[effect] || effectColours.RESISTANCE;
}

export function findState({ resistanceProfile }, antibioticKey) {
  for (const profile of resistanceProfile) {
    if (profile.agent.key === antibioticKey) {
      return profile.state;
    }
  }
}

export function hasResistanceState(state) {
  return state.toUpperCase() !== 'NOT_FOUND';
}

export function isResistant({ resistanceProfile }, antibioticKey) {
  for (const profile of resistanceProfile) {
    if (profile.agent.key === antibioticKey) {
      return profile.state in stateColours;
    }
  }
  return false;
}

export function hasElement(genome, type, element) {
  const { paarsnp } = genome.analysis;
  if (!paarsnp) return false;
  return paarsnp[type].indexOf(element) !== -1;
}

export function kleborateIsResistant({ amr }, antibiotic) {
  // If there is a match in e.g. Bla_ESBL_inhR then Bla_ESBL is also true.
  if (!!amr.profile &&
    antibiotic in multiClassFields &&
    multiClassFields[antibiotic] in amr.profile &&
    amr.profile[multiClassFields[antibiotic]].resistant) {
    return true;
  }
  return !!amr.profile &&
    antibiotic in amr.profile &&
    !!amr.profile[antibiotic].resistant;
}

export function kleborateMatches({ key }, { amr }) {
  return !!amr.profile && key in multiClassFields ?
    mergeMatches(key, multiClassFields[key], amr.profile) :
    // mergeColumnInto(key, multiClassFields[key], amr.profile) :
    amr.profile[key].matches;
}

export function kleborateCleanElement(element) {
  return element
    .replace('^', '')
    .replace('*', '')
    .replace('?', '')
    .replace(/\.v\d/, '')
    .replace(/-\d+%/g, '_truncated');
}

export function kleborateHasElement({ amr: { profile } }, antibiotic, element) {
  if (element === '-' || !profile) return false;
  for (const key of Object.keys(profile)) {
    if (!('name' in profile[key]) || profile[key].name !== antibiotic) {
      continue;
    }
    if (profile[key].matches === '-') return false;
    const elements = profile[key].matches.split(';').map(text => kleborateCleanElement(text));
    return elements.includes(element);
  }
  return false;
}

export function defaultColourGetter(genome) {
  if (genome && genome.__isCollection) {
    return CGPS.COLOURS.PURPLE_LIGHT;
  }
  return CGPS.COLOURS.GREY;
}

export function getColour(antibiotic, genome) {
  const { paarsnp } = genome.analysis;
  if (!paarsnp) {
    return defaultColourGetter(genome);
  }
  const state = findState(paarsnp, antibiotic);
  return hasResistanceState(state) ? getStateColour(state) : nonResistantColour;
}

export function getAdvancedColour({ key, effect }, type, genome) {
  const { paarsnp } = genome.analysis;
  if (!paarsnp) {
    return defaultColourGetter(genome);
  }

  if (hasElement(genome, type, key)) {
    return stateColours[effect] || stateColours.RESISTANT;
  }
  return nonResistantColour;
}

function getColours(columns, genome) {
  const colours = [];
  if (columns.size) {
    for (const column of columns) {
      colours.push(column.valueGetter(genome));
    }
  } else {
    colours.push(defaultColourGetter(genome));
  }
  return new Set(colours);
}

export function createColourGetter(table, multi) {
  return function (genome) {
    const colours = getColours(table.activeColumns, genome);
    if (colours.size === 1) {
      return Array.from(colours)[0];
    }

    if (multi && colours.has(nonResistantColour)) {
      return nonResistantColour;
    }

    colours.delete(nonResistantColour);
    const remainingColours = Array.from(colours);
    if (remainingColours.length === 1) return remainingColours[0];
    return stateColours.RESISTANT;
  };
}
