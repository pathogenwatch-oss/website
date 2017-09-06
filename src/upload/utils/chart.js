const baseColours = [
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

function lightenDarkenColor(colour, amt) {
  let usePound = false;
  let col = colour;

  if (col[0] === '#') {
    col = col.slice(1);
    usePound = true;
  }

  const num = parseInt(col, 16);

  let r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  let b = ((num >> 8) & 0x00FF) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  let g = (num & 0x0000FF) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
}

const darkColours = baseColours.map(c => lightenDarkenColor(c, -20));
const lightColours = baseColours.map(c => lightenDarkenColor(c, 20));

const colourMap = new Map();
let usedColours = 0;

export function getColour(name) {
  if (name === 'Pending') return '#ccc';

  if (!colourMap.has(name)) {
    const newColour = darkColours[(usedColours++) % darkColours.length];
    colourMap.set(name, newColour);
  }

  return colourMap.get(name);
}

export function getLightColour(colour) {
  return lightColours[darkColours.indexOf(colour)];
}
