import createCanvasLasso from '../../canvas-lasso';
import { translateCanvasToGraph, translateGraphToCanvas } from './sigma.transformations';

export default function (sigmaInst, options) {
  const renderer = sigmaInst.renderers[0];
  const mouseCanvas = renderer.domElements.mouse;
  renderer.initDOM('canvas', 'lasso');
  const drawingCanvas = renderer.domElements.lasso;
  mouseCanvas.parentElement.insertBefore(drawingCanvas, mouseCanvas);

  const width = renderer.width;
  const height = renderer.height;
  renderer.width = 0;
  renderer.height = 0;
  renderer.resize(width, height);

  const lasso = createCanvasLasso(
    mouseCanvas,
    drawingCanvas,
    {
      clearBeforeDraw: true,
      isActive: options.isActive,
      path: options.path,
      onPathChange: options.onPathChange,
      translateToCanvas: (points) => translateGraphToCanvas(sigmaInst, points),
      translateFromCanvas: (x, y) => translateCanvasToGraph(sigmaInst, x, y),
      onRedrawRequested: () => {
        lasso.draw();
        lasso.updateCanvas();
      },
    },
  );

  sigmaInst.renderers[0].bind('render', lasso.draw);

  return lasso;
}
