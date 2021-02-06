/* eslint max-params: 0 */
/* eslint no-param-reassign: 0 */

import drawShape from '../shape/draw';
import theme from '../theme';

export const nodeRenderer = function (node, ctx, settings) {
  const camera = settings('_camera');
  if (!camera) return;

  if (node.isActive !== false) {
    const nodeRatio = Math.pow(camera.ratio, settings('nodesPowRatio'));
    const proportionalNodeSize = node[settings('rendererSizeKey')] * nodeRatio;
    if (proportionalNodeSize) {
      drawShape(
        ctx,
        node[settings('rendererXKey')],
        node[settings('rendererYKey')],
        proportionalNodeSize,
        node.style.shape,
        node.style.colour,
        node.isHighlighted ? theme.primaryColour : null,
      );
    }
  }
};

export const edgeRenderer = function (edge, source, target, ctx, settings) {
  const camera = settings('_camera');
  if (!camera) return;

  if (source.isActive !== false && target.isActive !== false) {
    ctx.strokeStyle = edge.style.colour || settings('defaultEdgeColor');
    ctx.lineWidth = edge.style.width || 1;
    switch (edge.style.line) {
      case 'dashed':
        ctx.setLineDash([ 4, 8 ]);
        break;
      case 'dotted':
        ctx.setLineDash([ 1, 2 ]);
        break;
      case 'solid':
      default:
        ctx.setLineDash([]);
    }
    ctx.beginPath();
    ctx.moveTo(
      source[settings('rendererXKey')],
      source[settings('rendererYKey')]
    );
    ctx.lineTo(
      target[settings('rendererXKey')],
      target[settings('rendererYKey')]
    );
    ctx.stroke();
    ctx.setLineDash([]);

    const nodeSize = source[settings('rendererSizeKey')];
    if (edge.style.label && nodeSize >= settings('labelThreshold')) {
      ctx.fillStyle = ctx.strokeStyle;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        edge.style.label,
        Math.round((source[settings('rendererXKey')] + target[settings('rendererXKey')]) / 2),
        Math.round((source[settings('rendererYKey')] + target[settings('rendererYKey')]) / 2)
      );
      ctx.textAlign = 'start';
      ctx.textBaseline = 'alphabetic';
    }
  }
};
