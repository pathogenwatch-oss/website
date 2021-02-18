/* eslint max-params: 0 */
/* eslint max-len: 0 */
/* eslint no-param-reassign: 0 */
/* eslint no-console: 0 */

import { isEmojiRegexp, Flags } from './emoji';
import drawHalo from '../drawing/halo';
import defaults from '../defaults';
import { Angles } from '../utils/drawing';

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

export default function (ctx, x, y, radius, shape = 'circle', colour = '#bababa', highlightColour, borderWidth = defaults.NODE_BORDER_WIDTH, borderStyle = defaults.NODE_BORDER_STYLE) {
  if (radius <= 0 || shape === 'none') {
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

  if (highlightColour) {
    drawHalo(ctx, x, y, radius, highlightColour);
  }
}
