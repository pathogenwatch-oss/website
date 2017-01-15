import { DEFAULT, CGPS } from '../app/constants';

const stateColours = {
  RESISTANT: DEFAULT.DANGER_COLOUR,
  INTERMEDIATE: DEFAULT.WARNING_COLOUR,
};
export const nonResistantColour = '#fff';
const stateColourMap = Object.keys(stateColours).reduce(
  (map, key) => map.set(stateColours[key], key),
  new Map().set(nonResistantColour, 'UNKNOWN')
);

export function isResistant({ antibiotics }, antibiotic) {
  if (!(antibiotic in antibiotics)) return false;

  return antibiotics[antibiotic].state !== 'UNKNOWN';
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
    return stateColours[paarsnp.antibiotics[antibiotic].state];
  }
  return nonResistantColour;
}

export function getAdvancedColour(element, type, genome) {
  const { resistanceProfile } = genome.analysis;
  if (!resistanceProfile) {
    return defaultColourGetter(genome);
  }

  if (resistanceProfile[type].indexOf(element) !== -1) {
    return stateColours.RESISTANT;
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
function getMixedStateColour(table) {
  return table === 'antibiotics' ? nonResistantColour : stateColours.RESISTANT;
}

export function createColourGetter(table, columns) {
  return function (genome) {
    const colours = getColours(columns, genome);
    return colours.size === 1 ?
      Array.from(colours)[0] :
      getMixedStateColour(table);
  };
}

export const getColourState = colour => stateColourMap.get(colour);
