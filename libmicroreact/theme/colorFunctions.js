function hexToComponents(colour) {
  const num = parseInt(colour.slice(1), 16);
  const r = (num >> 16);
  const g = ((num >> 8) & 0x00FF);
  const b = (num & 0x0000FF);
  return { r, g, b };
}

function rgbaToComponents(colour) {
  const [ r, g, b, a ] = colour.slice(5).slice(0, -1).split(',');
  return {
    r: parseInt(r, 10),
    g: parseInt(g, 10),
    b: parseInt(b, 10),
    a: parseInt(a, 10),
  };
}

function getComponents(colour) {
  if (colour[0] === '#') {
    return hexToComponents(colour);
  } else if (colour.startsWith('rgba')) {
    return rgbaToComponents(colour);
  }
  throw new Error('Colour format not supported');
}

function adjust(component, amount) {
  let c = component;
  c += amount;
  if (c > 255) c = 255;
  else if (c < 0) c = 0;
  return c;
}

export function lightenDarken(colour, percent) {
  const amount = Math.round((255 / 100) * percent);
  const components = getComponents(colour);
  let { r, g, b } = components;
  r = adjust(r, amount);
  g = adjust(g, amount);
  b = adjust(b, amount);
  const { a } = components;
  if (a !== undefined) {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return `#${(b | (g << 8) | (r << 16)).toString(16)}`;
}

export function alpha(colour, amount) {
  const { r, g, b } = getComponents(colour);
  return `rgba(${r}, ${g}, ${b}, ${amount})`;
}
