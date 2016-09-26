import { setColourColumns } from '../actions/table';

import { defaultColourGetter } from '../constants/tree';

import DEFAULT from '../defaults';

const resistantColour = DEFAULT.DANGER_COLOUR;
const nonResistantColour = '#fff';

export function getColour(antibiotic, assembly) {
  const { analysis } = assembly;
  if (!analysis.resistanceProfile) {
    return defaultColourGetter(assembly);
  }
  const value = analysis.resistanceProfile[antibiotic];
  return value === 'RESISTANT' ? resistantColour : nonResistantColour;
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

const canvas = document.createElement('canvas').getContext('2d');
canvas.font = 'Bold 12px "Helvetica","Arial",sans-serif';

export function measureText(text) {
  return (canvas.measureText(text.toUpperCase()).width * Math.cos(0.785)) + 40;
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
