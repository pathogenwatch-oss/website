const colours = [
  '#834B96',
  '#B668A6',
  '#756E94',
  '#97B5BE',
  '#92A3B8',
  '#E8E0EE',
  '#BFABCF',
  '#CFC1DB',
  '#9070AC',
  '#A389BB',
  '#8968A7',
  '#9D81B6',
];

const lightColours = [
  '#B285C1',
  '#D7ACCF',
  '#AEAAC0',
  '#D6E2E5',
  '#D1D8E1',
  '#FFFFFF',
  '#F0ECF4',
  '#FFFFFF',
  '#C3B1D2',
  '#D7CBE1',
  '#BBA8CC',
  '#CFC1DC',
];

const colourMap = new Map();
let usedColours = 0;

export function getColour(name) {
  if (name === 'Pending') return '#ccc';

  if (!colourMap.has(name)) {
    const newColour = colours[(usedColours++) % colours.length];
    colourMap.set(name, newColour);
  }

  return colourMap.get(name);
}

export function getLightColour(name) {
  return lightColours[colours.indexOf(getColour(name))];
}
