import defaults from '../defaults';

/* eslint max-params: 0 */
export default function (ctx, x, y, radius, colour) {
  ctx.strokeStyle = colour;
  const _lineWidth = ctx.lineWidth;
  ctx.lineWidth = defaults.HALO_WIDTH;
  ctx.beginPath();
  ctx.arc(x, y, radius + defaults.NODE_RADIUS + Math.floor((radius / defaults.NODE_RADIUS) / 2), 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.stroke();
  ctx.lineWidth = _lineWidth;
}
