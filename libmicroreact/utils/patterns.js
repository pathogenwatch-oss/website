import DEFAULTS from '../defaults';

const LINE_WIDTH = 1;
const MARKER_SIZE = 14;

const canvas = document.createElement('canvas');
canvas.width = MARKER_SIZE;
canvas.height = MARKER_SIZE;
const ctx = canvas.getContext('2d');
ctx.lineWidth = LINE_WIDTH;
ctx.strokeStyle = DEFAULTS.COLOUR_DARK;

const patternSize = 4;
const patternCanvas = document.createElement('canvas');
patternCanvas.width = patternSize;
patternCanvas.height = patternSize;
const patternCtx = patternCanvas.getContext('2d');

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

  return ctx.createPattern(patternCanvas, 'repeat');
}
