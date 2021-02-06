/* eslint max-params: 0 */
/* eslint max-len: 0 */
/* eslint no-param-reassign: 0 */
/* eslint no-console: 0 */

import drawHalo from '../drawing/halo';
import defaults from '../defaults';

import { Angles } from '../utils/drawing';

export default function (ctx, x, y, radius, slices = {}, highlightColour = null, borderWidth = defaults.NODE_BORDER_WIDTH, borderStyle = defaults.NODE_BORDER_STYLE) {
  let startingAngle = 0;

  for (const colour of Object.keys(slices)) {
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const endingAngle = startingAngle + (Math.PI * 2 * slices[colour]);
    ctx.arc(x, y, radius, startingAngle, endingAngle, false);
    ctx.fill();
    ctx.closePath();
    startingAngle = endingAngle;
  }

  if (borderWidth > 0) {
    ctx.beginPath();
    ctx.arc(x, y, radius, Angles.Degrees0, Angles.Degrees360);
    ctx.strokeStyle = borderStyle;
    ctx.strokeWidth = borderWidth;
    ctx.stroke();
    ctx.closePath();
  }

  if (highlightColour) {
    drawHalo(ctx, x, y, radius, highlightColour);
  }
}
