import { defaultColourGetter } from '../constants/tree';

import DEFAULT from '../defaults';

const nonResistantColour = '#fff';

export function getColour(antibiotic, assembly) {
  const { analysis } = assembly;
  if (!analysis.resistanceProfile) {
    return defaultColourGetter(assembly);
  }
  const value = analysis.resistanceProfile[antibiotic];
  return value === 'RESISTANT' ? DEFAULT.DANGER_COLOUR : nonResistantColour;
}

export function createColourGetter(columns) {
  return function (assembly) {
    const colours = new Set(
      Array.from(columns).map(column => column.valueGetter(assembly))
    );
    return colours.size === 1 ? Array.from(colours)[0] : nonResistantColour;
  };
}
