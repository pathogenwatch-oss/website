import { setColourColumns } from '../collection-viewer/table/actions';
import { getAMRTableName, getActiveAMRTable } from '../collection-viewer/table/selectors';

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
export const getColourState = colour => stateColourMap.get(colour);

export function getEffectColour(effect) {
  return stateColours[effect] || stateColours.RESISTANT;
}

export function isResistant({ antibiotics }, antibiotic) {
  if (!(antibiotic in antibiotics)) return false;

  return antibiotics[antibiotic].state !== 'UNKNOWN';
}

export function hasElement(assembly, type, element) {
  const { resistanceProfile } = assembly.analysis;
  if (!resistanceProfile) return false;
  return resistanceProfile[type].indexOf(element) !== -1;
}

export function defaultColourGetter(assembly) {
  if (assembly.__isCollection) {
    return CGPS.COLOURS.PURPLE_LIGHT;
  }
  return CGPS.COLOURS.GREY;
}

export function getColour(antibiotic, assembly) {
  const { resistanceProfile } = assembly.analysis;
  if (!resistanceProfile) {
    return defaultColourGetter(assembly);
  }

  if (isResistant(resistanceProfile, antibiotic)) {
    return stateColours[resistanceProfile.antibiotics[antibiotic].state];
  }
  return nonResistantColour;
}

export function getAdvancedColour({ key, effect }, type, assembly) {
  const { resistanceProfile } = assembly.analysis;
  if (!resistanceProfile) {
    return defaultColourGetter(assembly);
  }

  if (hasElement(assembly, type, key)) {
    console.log(effect, stateColours[effect]);
    return stateColours[effect] || stateColours.RESISTANT;
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
function getMixedStateColour(table, colours) {
  if (table === 'antibiotics') return nonResistantColour;

  colours.delete(nonResistantColour);
  const remainingColours = Array.from(colours);
  if (remainingColours.length === 1) return remainingColours[0];
  return stateColours.RESISTANT;
}

export function createColourGetter(table, columns) {
  return function (assembly) {
    const colours = getColours(columns, assembly);
    return colours.size === 1 ?
      Array.from(colours)[0] :
      getMixedStateColour(table, colours);
  };
}

function isDeselection(columns, activeColumns) {
  return activeColumns.size &&
    activeColumns.size === columns.length &&
    Array.from(activeColumns).every(column => columns.indexOf(column) !== -1);
}

export function onHeaderClick(event, column) {
  return (dispatch, getState) => {
    const state = getState();
    const name = getAMRTableName(state);
    const { activeColumns } = getActiveAMRTable(state);

    const columns = column.group ?
      column.columns.filter(_ => _.valueGetter && !_.hidden) :
      [ column ];
    const partiallySelected =
      column.group && columns.some(c => !activeColumns.has(c));

    const cumulative = (event.metaKey || event.ctrlKey);
    if (cumulative) {
      for (const c of columns) {
        if (column.group && partiallySelected) activeColumns.add(c);
        else activeColumns[activeColumns.has(c) ? 'delete' : 'add'](c);
      }
      dispatch(setColourColumns(name, new Set(activeColumns)));
      return;
    }

    if (isDeselection(columns, activeColumns)) {
      dispatch(setColourColumns(name, new Set()));
      return;
    }

    dispatch(setColourColumns(name, new Set(columns)));
  };
}
