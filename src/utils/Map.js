import { COLOUR, CGPS } from '../defaults';

const MARKER_SIZE = 18;
const LINE_WIDTH = 2;

const canvas = document.createElement('canvas');
canvas.width = MARKER_SIZE + LINE_WIDTH;
canvas.height = MARKER_SIZE + LINE_WIDTH;

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
  circle(fillColour, strokeColour = COLOUR) {
    context.beginPath();
    context.arc(centerX, centerY, scaledRadius, 0, Math.PI * 2, false);
    context.fillStyle = fillColour;
    context.fill();
    context.strokeStyle = strokeColour;
    context.stroke();
    context.closePath();
  },
  square(fillColour, strokeColour = COLOUR) {
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
  circle([ colour1, colour2 ], strokeColour = COLOUR) {
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
  square([ colour1, colour2 ], strokeColour = COLOUR) {
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

function drawIcon(tracePath, fillColour) {
  context.clearRect(0, 0, MARKER_SIZE, MARKER_SIZE);
  tracePath(fillColour);
  return canvas.toDataURL();
}

const ICONS = {};
function getIcon(shape, colours) {
  const key = `${shape}|${colours.join('|')}`;
  if (!ICONS[key]) {
    ICONS[key] =
      colours.length === 2 ?
        drawIcon(doubleColour[shape], colours) :
        drawIcon(singleColour[shape], colours[0]);
  }
  return ICONS[key];
}

export const standardMarkerIcon =
  getIcon('circle', [ CGPS.COLOURS.PURPLE_LIGHT ]);

export function getMarkerIcon(shape, colours) {
  return getIcon(shape, Array.from(colours).sort());
}

function hasNoPosition({ metadata = {} }) {
  const { position } = metadata;
  return !position || !position.latitude || !position.longitude;
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

    const positionKey = JSON.stringify(assembly.metadata.position);
    if (markersByPosition.has(positionKey)) {
      markersByPosition.get(positionKey).
        assemblyIds.push(assembly.metadata.assemblyId);
      continue;
    }

    markersByPosition.set(positionKey, {
      position: JSON.parse(positionKey),
      assemblyIds: [ assembly.metadata.assemblyId ],
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
