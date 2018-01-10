import { DEFAULT, CGPS } from '../app/constants';

const stateColours = {
  RESISTANT: DEFAULT.DANGER_COLOUR,
  INDUCIBLE: '#E68D44',
  INTERMEDIATE: DEFAULT.WARNING_COLOUR,
};
export const nonResistantColour = '#fff';
const stateColourMap = Object.keys(stateColours).reduce(
  (map, key) => map.set(stateColours[key], key),
  new Map([
    [ nonResistantColour, 'UNKNOWN' ],
    [ nonResistantColour, 'NOT_FOUND' ],
  ])
);
export const getColourState = colour => stateColourMap.get(colour);

export function getEffectColour(effect) {
  return stateColours[effect] || stateColours.RESISTANT;
}

export function isResistant({ antibiotics }, antibiotic) {
  if (!(antibiotic in antibiotics)) return false;
  const { state } = antibiotics[antibiotic];
  return state in stateColours;
}

export function hasElement(genome, type, element) {
  const { paarsnp } = genome.analysis;
  if (!paarsnp) return false;
  return paarsnp[type].indexOf(element) !== -1;
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

  if (isResistant(paarsnp, antibiotic)) {
    return getEffectColour(paarsnp.antibiotics[antibiotic].state);
  }
  return nonResistantColour;
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
