/* eslint no-param-reassign: 0 */
import theme from '../theme';
import isPointInsidePath from './isPointInsidePath';

function drawLines(ctx, coordinates) {
  ctx.moveTo(coordinates[0].x, coordinates[0].y);
  for (let i = 1; i < coordinates.length; i++) {
    ctx.lineTo(coordinates[i].x, coordinates[i].y);
  }
  ctx.stroke();
}

function drawPoints(ctx, coordinates, r, drawLast) {
  for (let i = 0; i < coordinates.length - (drawLast ? 1 : 0); i++) {
    ctx.fillRect(coordinates[i].x - r, coordinates[i].y - r, r * 2, r * 2);
    ctx.strokeRect(
      coordinates[i].x - r + ctx.lineWidth,
      coordinates[i].y - r + ctx.lineWidth,
      r * 2 - ctx.lineWidth,
      r * 2 - ctx.lineWidth
    );
  }
}

export default function canvasLasso(mouseCanvas, drawingCanvas, options) {
  const lasso = Object.assign({
    clearBeforeDraw: false,
    dotsStyle: '#383838',
    isActive: false,
    lineWidth: 2,
    path: null,
    pointFillStyle: '#ffffff',
    pointSize: 14,
    pointStrokeStyle: '#000000',
    strokeStyle: theme.primaryColour,
    draw: () => {
      const ctx = drawingCanvas.getContext('2d');
      if (lasso.clearBeforeDraw) {
        ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
      }
      const path = lasso.internalPath || lasso.path;
      if (lasso.isActive) {
        if (Array.isArray(path) && path.length > 0) {
          const scale = 1;
          ctx.strokeStyle = lasso.strokeStyle;
          ctx.lineWidth = lasso.lineWidth * scale;
          ctx.beginPath();
          const points = lasso.translateToCanvas(path);
          drawLines(ctx, points);
          ctx.lineWidth = 1 * scale;
          ctx.fillStyle = lasso.pointFillStyle;
          ctx.strokeStyle = lasso.pointStrokeStyle;
          drawPoints(ctx, points, scale * lasso.pointSize / 2, !!lasso.path);
          ctx.closePath();
        }
      }
    },
    destroy: () => {
      mouseCanvas.removeEventListener('mousedown', handleMousedown);
      mouseCanvas.removeEventListener('mouseup', handleMouseup);
    },
    isPointInside: (point, path) => isPointInsidePath(point, path || lasso.path),
    onPathChange: (path) => {
      lasso.setPath(path);
      lasso.draw();
    },
    onRedrawRequested: () => {
      lasso.draw();
      lasso.updateCanvas();
    },
    setActive: (isActive) => {
      lasso.isActive = isActive;
      lasso.updateCanvas();
    },
    setPath: (path) => {
      lasso.path = path;
      lasso.internalPath = null;
      lasso.updateCanvas();
    },
    translateToCanvas: (points) => points,
    translateFromCanvas: (x, y) => ({ x, y }),
    updateCanvas: () => {
      if (lasso.isActive) {
        if (!Array.isArray(lasso.path)) {
          mouseCanvas.style.cursor = 'crosshair';
          mouseCanvas.title = 'Click to draw points';
        } else {
          mouseCanvas.style.cursor = null;
          mouseCanvas.title = 'Click outside the path to clear';
        }
      } else {
        mouseCanvas.style.cursor = null;
        mouseCanvas.title = '';
        if (lasso.internalPath) {
          lasso.internalPath = null;
        }
      }
    },

  }, options);

  const handleOnClick = (event) => {
    if (!lasso.isActive) return;

    const point = lasso.translateFromCanvas(event.offsetX, event.offsetY);

    if (Array.isArray(lasso.path)) {
      if (!isPointInsidePath(point, lasso.path)) {
        lasso.onPathChange(null);
      }
      return;
    }

    if (!lasso.internalPath) {
      lasso.internalPath = [];
    }

    if (lasso.internalPath.length > 0) {
      const padding = lasso.pointSize;
      const pointTopLeft = lasso.translateFromCanvas(event.offsetX - padding, event.offsetY - padding);
      const pointBottomRight = lasso.translateFromCanvas(event.offsetX + padding, event.offsetY + padding);
      if (pointBottomRight.x >= lasso.internalPath[0].x &&
          pointTopLeft.x <= lasso.internalPath[0].x &&
          pointBottomRight.y >= lasso.internalPath[0].y &&
          pointTopLeft.y <= lasso.internalPath[0].y
      ) {
        // push the first point to the end of the path to close the polygon
        // and mark the path as finished
        const path = lasso.internalPath;
        path.push(path[0]);
        lasso.internalPath = null;
        lasso.onPathChange(path);
        return;
      }
    }

    lasso.internalPath.push(point);

    if (lasso.onRedrawRequested) {
      lasso.onRedrawRequested();
    }
  };

  let offsetX = null;
  let offsetY = null;
  const handleMousedown = (event) => {
    offsetX = event.offsetX;
    offsetY = event.offsetY;
  };

  const handleMouseup = (event) => {
    if (Math.abs(offsetX - event.offsetX) < 5 && Math.abs(offsetY - event.offsetY) < 5) {
      handleOnClick(event);
    }
    offsetX = null;
    offsetY = null;
  };

  mouseCanvas.addEventListener('mousedown', handleMousedown, false /* useCapture */);
  mouseCanvas.addEventListener('mouseup', handleMouseup, false /* useCapture */);

  lasso.updateCanvas();

  return lasso;
}
