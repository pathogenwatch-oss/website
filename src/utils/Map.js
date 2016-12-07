import { DEFAULT, CGPS } from '../app/constants';

const CANVAS_SIZE = 40;
const MARKER_SIZE = 18;
const LINE_WIDTH = 2;

const canvas = document.createElement('canvas');
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

const context = canvas.getContext('2d');
context.lineWidth = LINE_WIDTH;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const radius = MARKER_SIZE / 2;
const lengthOfSquareSide = radius * Math.sqrt(2);
const squareStartX = centerX - lengthOfSquareSide / 2;
const scaledArea = Math.pow(lengthOfSquareSide, 2);
const scaledRadius = Math.sqrt(scaledArea / Math.PI);

const singleColour = {
  circle(fillColour, strokeColour = DEFAULT.COLOUR) {
    context.beginPath();
    context.arc(centerX, centerY, scaledRadius, 0, Math.PI * 2, false);
    context.fillStyle = fillColour;
    context.fill();
    context.strokeStyle = strokeColour;
    context.stroke();
    context.closePath();
  },
  square(fillColour, strokeColour = DEFAULT.COLOUR) {
    context.beginPath();
    context.moveTo(squareStartX, centerY);
    context.lineTo(squareStartX, centerY + lengthOfSquareSide / 2);
    context.lineTo(squareStartX + lengthOfSquareSide, centerY + lengthOfSquareSide / 2);
    context.lineTo(squareStartX + lengthOfSquareSide, centerY - lengthOfSquareSide / 2);
    context.lineTo(squareStartX, centerY - lengthOfSquareSide / 2);
    context.lineTo(squareStartX, centerY);
    context.fillStyle = fillColour;
    context.fill();
    context.strokeStyle = strokeColour;
    context.stroke();
    context.closePath();
  },
};

const doubleColour = {
  circle([ colour1, colour2 ], strokeColour = DEFAULT.COLOUR) {
    context.beginPath();
    context.arc(centerX, centerY, scaledRadius, Math.PI * 0.5, Math.PI * 1.5, false);
    context.fillStyle = colour1;
    context.fill();
    context.closePath();

    context.beginPath();
    context.arc(centerX, centerY, scaledRadius, Math.PI * 1.5, Math.PI * 0.5, false);
    context.fillStyle = colour2;
    context.fill();
    context.closePath();

    context.beginPath();
    context.arc(centerX, centerY, scaledRadius, 0, Math.PI * 2, false);
    context.strokeStyle = strokeColour;
    context.stroke();
    context.closePath();
  },
  square([ colour1, colour2 ], strokeColour = DEFAULT.COLOUR) {
    context.beginPath();
    context.moveTo(squareStartX, centerY);
    context.lineTo(squareStartX, centerY + lengthOfSquareSide / 2);
    context.lineTo(squareStartX + lengthOfSquareSide / 2, centerY + lengthOfSquareSide / 2);
    context.lineTo(squareStartX + lengthOfSquareSide / 2, centerY - lengthOfSquareSide / 2);
    context.lineTo(squareStartX, centerY - lengthOfSquareSide / 2);
    context.lineTo(squareStartX, centerY);
    context.fillStyle = colour1;
    context.fill();
    context.closePath();

    context.beginPath();
    context.moveTo(centerX, centerY);
    context.lineTo(centerX, centerY + lengthOfSquareSide / 2);
    context.lineTo(centerX + lengthOfSquareSide / 2, centerY + lengthOfSquareSide / 2);
    context.lineTo(centerX + lengthOfSquareSide / 2, centerY - lengthOfSquareSide / 2);
    context.lineTo(centerX, centerY - lengthOfSquareSide / 2);
    context.lineTo(centerX, centerY);
    context.fillStyle = colour2;
    context.fill();
    context.closePath();

    context.beginPath();
    context.moveTo(squareStartX, centerY);
    context.lineTo(squareStartX, centerY + lengthOfSquareSide / 2);
    context.lineTo(squareStartX + lengthOfSquareSide, centerY + lengthOfSquareSide / 2);
    context.lineTo(squareStartX + lengthOfSquareSide, centerY - lengthOfSquareSide / 2);
    context.lineTo(squareStartX, centerY - lengthOfSquareSide / 2);
    context.lineTo(squareStartX, centerY);
    context.strokeStyle = strokeColour;
    context.stroke();
    context.closePath();
  },
};

const HALO_WIDTH = 4;
const HALO_RADIUS = CANVAS_SIZE / 2 - HALO_WIDTH;
function drawHalo() {
  context.beginPath();
  context.arc(centerX, centerY, HALO_RADIUS, 0, Math.PI * 2, false);
  context.strokeStyle = CGPS.COLOURS.PURPLE;
  context.lineWidth = HALO_WIDTH;
  context.stroke();
  context.closePath();
  context.lineWidth = LINE_WIDTH;
}

function drawIcon(tracePath, fillColour, highlighted) {
  context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  tracePath(fillColour);
  if (highlighted) {
    drawHalo();
  }

  return canvas.toDataURL();
}

const ICONS = {};
function getIcon(shape, colours, highlighted = false) {
  const key = `${shape}|${colours.join('|')}|${highlighted}`;
  if (!ICONS[key]) {
    ICONS[key] =
      colours.length === 2 ?
        drawIcon(doubleColour[shape], colours, highlighted) :
        drawIcon(singleColour[shape], colours[0], highlighted);
  }
  return ICONS[key];
}

export const standardMarkerIcon =
  getIcon('circle', [ CGPS.COLOURS.PURPLE_LIGHT ]);


const MARKER_OFFSET = (CANVAS_SIZE - MARKER_SIZE) / 2;
const coords = {
  square: [ 0, 0, MARKER_SIZE, MARKER_SIZE ],
  circle: [ MARKER_SIZE / 2, MARKER_SIZE / 2, scaledRadius + LINE_WIDTH ],
  highlighted: [ CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 2 ],
};

export function getMarkerIcon(shape, colours, highlighted) {
  return {
    image: getIcon(
      shape,
      Array.from(colours).sort(),
      highlighted
    ),
    size: highlighted ? CANVAS_SIZE : MARKER_SIZE,
    offset: highlighted ? 0 : MARKER_OFFSET,
    shape: {
      type: highlighted ? 'circle' : shape === 'square' ? 'rect' : shape,
      coords: highlighted ? coords.highlighted : coords[shape],
    },
  };
}

function hasNoPosition({ metadata = {} }) {
  const { position } = metadata;
  return !position || !position.latitude || !position.longitude;
}

function getPositionKey({ latitude, longitude }) {
  return JSON.stringify({
    latitude: latitude.toFixed(6), // 6 avoids rounding at 5dp
    longitude: longitude.toFixed(6),
  });
}

export function addAssembliesToMarkerDefs(assemblies, existingMarkers = []) {
  const markersByPosition = existingMarkers.reduce((map, marker) => {
    map.set(JSON.stringify(marker.position), marker);
    return map;
  }, new Map());

  for (const assembly of assemblies) {
    if (hasNoPosition(assembly)) {
      continue;
    }

    const positionKey = getPositionKey(assembly.position);
    if (markersByPosition.has(positionKey)) {
      markersByPosition.get(positionKey).
        assemblyIds.push(assembly.uuid);
      continue;
    }

    markersByPosition.set(positionKey, {
      position: JSON.parse(positionKey),
      assemblyIds: [ assembly.uuid ],
      active: true,
      visible: true,
    });
  }

  return Array.from(markersByPosition.values());
}

function mapByPosition(assemblies) {
  return assemblies.reduce((map, assembly) => {
    if (hasNoPosition(assembly)) {
      return map;
    }
    const positionKey = JSON.stringify(assembly.metadata.position);
    if (map.has(positionKey)) {
      map.get(positionKey).push(assembly);
    } else {
      map.set(positionKey, [ assembly ]);
    }
    return map;
  }, new Map());
}

function getMarkerDefinitions(assemblies, createInfoWindow) {
  return Array.from(mapByPosition(assemblies).entries()).
    map(([ position, assembliesAtPosition ]) => {
      return {
        position: JSON.parse(position),
        active: true,
        visible: true,
        infoWindow:
          createInfoWindow ? createInfoWindow(assembliesAtPosition) : null,
      };
    });
}

export default {
  getMarkerDefinitions,
  getMarkerIcon,
  standardMarkerIcon,
};
