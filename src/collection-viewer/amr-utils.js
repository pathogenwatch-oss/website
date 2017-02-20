import { DEFAULT, CGPS } from '../app/constants';

const stateColours = {
  RESISTANT: DEFAULT.DANGER_COLOUR,
  INDUCIBLE: '#E68D44',
  INTERMEDIATE: DEFAULT.WARNING_COLOUR,
};
export const nonResistantColour = '#fff';
const stateColourMap = Object.keys(stateColours).reduce(
  (map, key) => map.set(stateColours[key], key),
  new Map().set(nonResistantColour, 'UNKNOWN')
);
export const getColourState = colour => stateColourMap.get(colour);

export function getEffectColour(effect) {
  return stateColours[effect] || stateColours.RESISTANT;
}

export function isResistant({ antibiotics }, antibiotic) {
  if (!(antibiotic in antibiotics)) return false;

  return antibiotics[antibiotic].state !== 'UNKNOWN';
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

const noActiveColumns = [ { valueGetter: defaultColourGetter } ];

function getColours(columns, genome) {
  return new Set(
    Array.from(columns.size ? columns : noActiveColumns).
      map(column => column.valueGetter(genome))
  );
}

// FIXME: name is hard-coded to avoid circular dependency
function getMixedStateColour(table, colours) {
  if (table === 'antibiotics') return nonResistantColour;

  colours.delete(nonResistantColour);
  const remainingColours = Array.from(colours);
  if (remainingColours.length === 1) return remainingColours[0];
  return stateColours.RESISTANT;
}

export function createColourGetter(table, columns) {
  return function (genome) {
    const colours = getColours(columns, genome);
    return colours.size === 1 ?
      Array.from(colours)[0] :
      getMixedStateColour(table, colours);
  };
}
