/* global sigma */
/* eslint new-cap: */

export function translateCanvasToGraph(sigmaInst, renderX, renderY) {
  const relCos = Math.cos(sigmaInst.camera.angle) / sigmaInst.camera.ratio;
  const relSin = Math.sin(sigmaInst.camera.angle) / sigmaInst.camera.ratio;
  const xOffset = (sigmaInst.renderers[0].width || 0) / 2 - sigmaInst.camera.x * relCos - sigmaInst.camera.y * relSin;
  const yOffset = (sigmaInst.renderers[0].height || 0) / 2 - sigmaInst.camera.y * relCos + sigmaInst.camera.x * relSin;
  const camX = (renderX - xOffset) / relCos;
  const camY = (renderY - yOffset) / relCos;
  const bounds = sigma.utils.getBoundaries(sigmaInst.graph, '', true);
  let minX = bounds.minX;
  let minY = bounds.minY;
  let maxX = bounds.maxX;
  let maxY = bounds.maxY;
  const w = sigmaInst.renderers[0].width;
  const h = sigmaInst.renderers[0].height;
  let scale = sigmaInst.settings('scalingMode') === 'outside' ? Math.max(w / Math.max(maxX - minX, 1), h / Math.max(maxY - minY, 1)) : Math.min(w / Math.max(maxX - minX, 1), h / Math.max(maxY - minY, 1));
  const margin = (sigmaInst.settings('rescaleIgnoreSize') ? 0 : (sigmaInst.settings('maxNodeSize') || bounds.sizeMax) / scale) + (sigmaInst.settings('sideMargin') || 0);
  maxX += margin;
  minX -= margin;
  maxY += margin;
  minY -= margin;
  scale = sigmaInst.settings('scalingMode') === 'outside' ? Math.max(w / Math.max(maxX - minX, 1), h / Math.max(maxY - minY, 1)) : Math.min(w / Math.max(maxX - minX, 1), h / Math.max(maxY - minY, 1));
  const np = -1;
  const nodeX = (camX / (np ? scale : 1)) + ((maxX + minX) / 2);
  const nodeY = (camY / (np ? scale : 1)) + ((maxY + minY) / 2);
  return ({ x: nodeX, y: nodeY });
}

export function translateGraphToCanvas(sigmaInst, points) {
  const relCos = Math.cos(sigmaInst.camera.angle) / sigmaInst.camera.ratio;
  const relSin = Math.sin(sigmaInst.camera.angle) / sigmaInst.camera.ratio;
  const xOffset = (sigmaInst.renderers[0].width || 0) / 2 - sigmaInst.camera.x * relCos - sigmaInst.camera.y * relSin;
  const yOffset = (sigmaInst.renderers[0].height || 0) / 2 - sigmaInst.camera.y * relCos + sigmaInst.camera.x * relSin;
  const bounds = sigma.utils.getBoundaries(sigmaInst.graph, '', true);
  let minX = bounds.minX;
  let minY = bounds.minY;
  let maxX = bounds.maxX;
  let maxY = bounds.maxY;
  const w = sigmaInst.renderers[0].width;
  const h = sigmaInst.renderers[0].height;
  let scale = sigmaInst.settings('scalingMode') === 'outside' ? Math.max(w / Math.max(maxX - minX, 1), h / Math.max(maxY - minY, 1)) : Math.min(w / Math.max(maxX - minX, 1), h / Math.max(maxY - minY, 1));
  const margin = (sigmaInst.settings('rescaleIgnoreSize') ? 0 : (sigmaInst.settings('maxNodeSize') || bounds.sizeMax) / scale) + (sigmaInst.settings('sideMargin') || 0);
  maxX += margin;
  minX -= margin;
  maxY += margin;
  minY -= margin;
  scale = sigmaInst.settings('scalingMode') === 'outside' ? Math.max(w / Math.max(maxX - minX, 1), h / Math.max(maxY - minY, 1)) : Math.min(w / Math.max(maxX - minX, 1), h / Math.max(maxY - minY, 1));
  const np = -1;
  return points.map(point => {
    const camX = (point.x - (maxX + minX) / 2) * (np ? scale : 1);
    const camY = (point.y - (maxY + minY) / 2) * (np ? scale : 1);
    const x = camX * relCos + camY * relSin + xOffset;
    const y = camY * relCos + camX * relSin + yOffset;
    return { x, y };
  });
}
