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

export function defaultColourGetter(assembly) {
  if (assembly && assembly.__isCollection) {
    return CGPS.COLOURS.PURPLE_LIGHT;
  }
  return CGPS.COLOURS.GREY;
}

export function getColour(antibiotic, assembly) {
  const { paarsnp } = assembly.analysis;
  if (!paarsnp) {
    return defaultColourGetter(assembly);
  }

  if (isResistant(paarsnp, antibiotic)) {
    return stateColours[paarsnp.antibiotics[antibiotic].state];
  }
  return nonResistantColour;
}

export function getAdvancedColour(element, type, assembly) {
  const { resistanceProfile } = assembly.analysis;
  if (!resistanceProfile) {
    return defaultColourGetter(assembly);
  }

  if (resistanceProfile[type].indexOf(element) !== -1) {
    return stateColours.RESISTANT;
  }
  return nonResistantColour;
}

const noActiveColumns = [ { valueGetter: defaultColourGetter } ];

function getColours(columns, assembly) {
  return new Set(
    Array.from(columns.size ? columns : noActiveColumns).
      map(column => column.valueGetter(assembly))
  );
}

// FIXME: name is hard-coded to avoid circular dependency
function getMixedStateColour(table) {
  return table === 'antibiotics' ? nonResistantColour : stateColours.RESISTANT;
}

export function createColourGetter(table, columns) {
  return function (assembly) {
    const colours = getColours(columns, assembly);
    return colours.size === 1 ?
      Array.from(colours)[0] :
      getMixedStateColour(table);
  };
}

export const getColourState = colour => stateColourMap.get(colour);
