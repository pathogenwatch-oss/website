import { isEmojiRegexp, Flags } from './emoji';

export const Angles = {
  Degrees0: 0,
  Degrees90: Math.PI * 0.5,
  Degrees180: Math.PI,
  Degrees270: Math.PI * 1.5,
  Degrees360: Math.PI * 2,
};

import defaults from '../defaults';

const LINE_WIDTH = 1;
const MARKER_SIZE = 14;

const tmpCanvas = document.createElement('canvas');
tmpCanvas.width = MARKER_SIZE;
tmpCanvas.height = MARKER_SIZE;
const tmpCtx = tmpCanvas.getContext('2d');
tmpCtx.lineWidth = LINE_WIDTH;
tmpCtx.strokeStyle = defaults.COLOUR_DARK;

const patternSize = 4;
const patternCanvas = document.createElement('canvas');
patternCanvas.width = patternSize;
patternCanvas.height = patternSize;
const patternCtx = patternCanvas.getContext('2d');

const fontCanvas = document.createElement('canvas');
const fontCtx = fontCanvas.getContext('2d');
fontCtx.font = '14px "Roboto", "Helvetica", "Arial", sans-serif';

function star(ctx, x, y, MARKER_CENTRE, spikes = 5) {
  const outerRadius = MARKER_CENTRE;
  const innerRadius = outerRadius * 0.5;
  const step = Math.PI / spikes;

  let rot = Math.PI / 2 * 3;
  ctx.moveTo(x, y - outerRadius);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
    rot += step;
    ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
    rot += step;
  }
  ctx.lineTo(x, y - outerRadius);
}

function polygon(ctx, x, y, MARKER_CENTRE, sides) {
  ctx.moveTo(x + MARKER_CENTRE * Math.cos(0), y + MARKER_CENTRE * Math.sin(0));
  for (let i = 1; i <= sides; i += 1) {
    ctx.lineTo(x + MARKER_CENTRE * Math.cos(i * 2 * Math.PI / sides), y + MARKER_CENTRE * Math.sin(i * 2 * Math.PI / sides));
  }
}


export function drawShape(ctx, x, y, radius, shape, colour, highlight = false, borderWidth = 1, borderStyle = 'rgba(0, 0, 0, 0.56)') {
  if (shape === 'none') {
    return;
  }

  ctx.fillStyle = colour;

  if (shape in Flags) {
    const font = ctx.font;
    ctx.font = `${radius * 2}px Segoe UI Emoji`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(Flags[shape], x, y - radius / 2);
    ctx.font = font;
  } else if (isEmojiRegexp.test(shape)) {
    ctx.font = `${radius * 2}px Segoe UI Emoji`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(shape, x, y - radius / 2);
  } else {
    ctx.beginPath();
    if (shape === 'dot') {
      ctx.arc(x, y, ctx.lineWidth * 2, Angles.Degrees0, Angles.Degrees360);
    } else if (shape === 'circle') {
      ctx.arc(x, y, radius, Angles.Degrees0, Angles.Degrees360);
    } else if (shape === 'square') {
      ctx.rect(x - radius, y - radius, radius * 2, radius * 2);
    } else if (shape === 'triangle') {
      ctx.moveTo(x, y - radius);
      ctx.lineTo(x + radius, y + radius);
      ctx.lineTo(x - radius, y + radius);
      ctx.lineTo(x, y - radius);
    } else if (shape === 'star') {
      star(ctx, x, y, radius, 5);
    } else if (shape === 'hexastar') {
      star(ctx, x, y, radius, 6);
    } else if (shape === 'heptastar') {
      star(ctx, x, y, radius, 7);
    } else if (shape === 'octastar') {
      star(ctx, x, y, radius, 8);
    } else if (shape === 'pentagon') {
      polygon(ctx, x, y, radius, 5);
    } else if (shape === 'hexagon') {
      polygon(ctx, x, y, radius, 6);
    } else if (shape === 'heptagon') {
      polygon(ctx, x, y, radius, 7);
    } else if (shape === 'octagon') {
      polygon(ctx, x, y, radius, 8);
    } else {
      console.error('Invalid shape', shape);
    }
    ctx.fill();

    if (borderWidth > 0) {
      ctx.strokeStyle = borderStyle;
      ctx.lineWidth = borderWidth;
      ctx.stroke();
    }
    ctx.closePath();
  }

  if (highlight) {
    ctx.strokeStyle = defaults.HIGHLIGHT_COLOUR;
    ctx.lineWidth = defaults.HIGHLIGHT_WIDTH;
    ctx.beginPath();
    ctx.arc(x, y, radius * 2, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.stroke();
    ctx.lineWidth = borderWidth;
  }
}

export function drawPieChart(ctx, x, y, radius, slices, highlight = false, borderWidth = 1) {
  let startingAngle = 0;
  for (const colour of Object.keys(slices)) {
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const endingAngle = startingAngle + (Math.PI * 2 * slices[colour]);
    // Arc Parameters: x, y, radius, startingAngle (radians), endingAngle (radians), antiClockwise (boolean)
    ctx.arc(x, y, radius, startingAngle, endingAngle, false);
    ctx.fill();
    ctx.closePath();
    startingAngle = endingAngle;
  }

  if (borderWidth > 0) {
    ctx.beginPath();
    ctx.arc(x, y, radius, Angles.Degrees0, Angles.Degrees360);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.56)';
    ctx.strokeWidth = borderWidth;
    ctx.stroke();
    ctx.closePath();
  }

  if (highlight) {
    ctx.strokeStyle = defaults.HIGHLIGHT_COLOUR;
    ctx.lineWidth = defaults.HIGHLIGHT_WIDTH;
    ctx.beginPath();
    ctx.arc(x, y, radius * 2, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.stroke();
    ctx.lineWidth = borderWidth;
  }
}

export function getGroupedColours(rows, rowStyles) {
  const groupedData = {};
  for (const row of rows) {
    const colour = rowStyles[row[0]].colour;
    if (!groupedData[colour]) {
      groupedData[colour] = 1;
    } else {
      groupedData[colour] += 1;
    }
  }
  for (const colour of Object.keys(groupedData)) {
    groupedData[colour] = groupedData[colour] / rows.length;
  }
  return groupedData;
}

export function getFillStyle(fillColour, pattern = 'solid') {
  if (pattern === 'solid') {
    return fillColour;
  }

  patternCtx.fillStyle = fillColour;
  patternCtx.fillRect(0, 0, patternSize, patternSize);
  patternCtx.fillStyle = 'white';
  if (pattern === 'vl') {
    patternCtx.fillRect(patternSize / 2, 0, patternSize / 2, patternSize);
  } else if (pattern === 'hl') {
    patternCtx.fillRect(0, patternSize / 2, patternSize, patternSize / 2);
  } else if (pattern === 'fs') {
    patternCtx.beginPath();
    patternCtx.moveTo(0, 0);
    patternCtx.lineTo(patternSize, 0);
    patternCtx.lineTo(0, patternSize);
    patternCtx.lineTo(0, 0);
    patternCtx.fill();
    patternCtx.closePath();
  } else if (pattern === 'bs') {
    patternCtx.beginPath();
    patternCtx.moveTo(0, 0);
    patternCtx.lineTo(patternSize, 0);
    patternCtx.lineTo(patternSize, patternSize);
    patternCtx.lineTo(0, 0);
    patternCtx.fill();
    patternCtx.closePath();
  } else {
    console.error(`Invalid pattern string '${pattern}'`);
    return 'transparent';
  }

  return tmpCtx.createPattern(patternCanvas, 'repeat');
}

export function hexToRgba(hex, alpha = 0.08) {
  const bigint = parseInt(hex.substr(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function measureTextWidth(text) {
  const textMetrics = fontCtx.measureText(text);
  fontCtx.fillText(text, 20, 20);
  return Math.ceil(textMetrics.width);
}
