import { setColourColumns } from '../actions/table';

import { DEFAULT, CGPS } from '../app/constants';

const colours = {
  RESISTANT: DEFAULT.DANGER_COLOUR,
  INTERMEDIATE: DEFAULT.WARNING_COLOUR,
};
const nonResistantColour = '#fff';

export function isResistant(profile, antibiotic) {
  if (!profile || !profile[antibiotic]) return false;

  return profile[antibiotic].state !== 'UNKNOWN';
}

export function defaultColourGetter(assembly) {
  if (assembly.__isCollection) {
    return CGPS.COLOURS.PURPLE_LIGHT;
  }
  return CGPS.COLOURS.GREY;
}

export function getColour(antibiotic, assembly) {
  const { analysis } = assembly;
  if (!analysis.resistanceProfile) {
    return defaultColourGetter(assembly);
  }

  if (isResistant(analysis.resistanceProfile, antibiotic)) {
    const { state } = analysis.resistanceProfile[antibiotic];
    return colours[state];
  }
  return nonResistantColour;
}

const noActiveColumns = [ { valueGetter: defaultColourGetter } ];

export function createColourGetter(columns) {
  return function (assembly) {
    const colours = new Set(
      Array.from(columns.size ? columns : noActiveColumns).
        map(column => column.valueGetter(assembly))
    );
    return colours.size === 1 ? Array.from(colours)[0] : nonResistantColour;
  };
}

export function onHeaderClick(event, { column, activeColumns }, dispatch) {
  const cumulative = (event.metaKey || event.ctrlKey);

  if (cumulative) {
    activeColumns[activeColumns.has(column) ? 'delete' : 'add'](column);
    dispatch(setColourColumns(new Set(activeColumns)));
    return;
  }

  if (activeColumns.has(column) && activeColumns.size === 1) {
    dispatch(setColourColumns(new Set()));
    return;
  }

  dispatch(setColourColumns(new Set([ column ])));
}

export function getIcon(resistanceState) {
  switch (resistanceState) {
    case 'RESISTANT':
      return 'check_circle';
    case 'INTERMEDIATE':
      return 'help';
    default:
      return null;
  }
}
