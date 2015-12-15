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

const radius = MARKER_SIZE / 2 - LINE_WIDTH;

function drawSingleColourMarker(fillColour, strokeColour = COLOUR) {
  context.clearRect(0, 0, MARKER_SIZE, MARKER_SIZE);

  context.beginPath();
  context.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
  context.fillStyle = fillColour;
  context.fill();
  context.strokeStyle = strokeColour;
  context.stroke();
  context.closePath();

  return canvas.toDataURL();
}

const standardMarkerIcon = drawSingleColourMarker(CGPS.COLOURS.PURPLE_LIGHT);
const filteredMarkerIcon = drawSingleColourMarker('transparent');

function drawDoubleColourMarker([ colour1, colour2 ], strokeColour = COLOUR) {
  context.clearRect(0, 0, MARKER_SIZE, MARKER_SIZE);

  context.beginPath();
  context.arc(centerX, centerY, radius, Math.PI * 0.5, Math.PI * 1.5, false);
  context.fillStyle = colour1;
  context.fill();
  context.closePath();

  context.beginPath();
  context.arc(centerX, centerY, radius, Math.PI * 1.5, Math.PI * 0.5, false);
  context.fillStyle = colour2;
  context.fill();
  context.closePath();

  context.beginPath();
  context.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
  context.strokeStyle = strokeColour;
  context.stroke();
  context.closePath();

  return canvas.toDataURL();
}

function getMarkerIcon(assemblies, colourGetter, collectionAssemblyIds) {
  const colours = new Set();
  for (const assembly of assemblies) {
    colours.add(colourGetter(assembly, collectionAssemblyIds));
  }
  return colours.size === 2 ?
    drawDoubleColourMarker(Array.from(colours).sort()) :
    drawSingleColourMarker(Array.from(colours)[0]);
}

function mapPositionsToAssemblies(assemblies) {
  const positionMap = new Map();

  for (const assembly of assemblies) {
    const { position } = assembly.metadata;
    if (!position || !position.latitude || !position.longitude) {
      continue;
    }

    const positionKey = JSON.stringify(position);
    if (positionMap.has(positionKey)) {
      positionMap.get(positionKey).push(assembly);
    } else {
      positionMap.set(positionKey, [ assembly ]);
    }
  }

  return positionMap;
}

function getMarkerDefinitions(assemblies, {
    onClick,
    createInfoWindow,
  } = {}) {
  return Array.from(mapPositionsToAssemblies(assemblies)).
    map(([ position, positionAssemblies ]) => {
      const assemblyIds = positionAssemblies.map(_ => _.metadata.assemblyId);
      return {
        position: JSON.parse(position),
        assemblyIds,
        icon: standardMarkerIcon,
        onClick: onClick ? onClick.bind(null, assemblyIds) : null,
        infoWindow: createInfoWindow ? createInfoWindow(positionAssemblies) : null,
        active: true,
        visible: true,
      };
    });
}

export default {
  getMarkerDefinitions,
  standardMarkerIcon,
  filteredMarkerIcon,
  getMarkerIcon,
};
