import MapStylesUtils from '../utils/MapStyles';

import { CGPS } from '../defaults';

const MARKER = {
  SIZE: {
    WIDTH: 12,
    HEIGHT: 12,
  },
};

function drawCircle(fillColour) {
  var canvas = document.createElement("canvas");
  canvas.width = MARKER.SIZE.WIDTH;
  canvas.height = MARKER.SIZE.HEIGHT;
  var context = canvas.getContext('2d');
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var radius = MARKER.SIZE.WIDTH / 2 - 1;
  var startAngle = 0;
  var endAngle = Math.PI * 2;
  var isAnticlockwise = false;

  context.beginPath();
  context.arc(centerX, centerY, radius, startAngle, endAngle, isAnticlockwise);
  context.fillStyle = fillColour;
  context.fill();
  context.lineWidth = 2;
  context.strokeStyle = CGPS.COLOURS.PURPLE;
  context.stroke();

  return canvas.toDataURL();
}

const standardMarkerIcon = drawCircle(CGPS.COLOURS.PURPLE_LIGHT)

function resistanceMarkerIcon(assemblies) {
  // TODO
}

function getMarkerDefinitions(assemblies, {
  getIcon = () => standardMarkerIcon,
  onClick,
  createInfoWindow,
} = {}) {
  const positionMap = new Map();

  for (const assembly of assemblies) {
    const { position } = assembly.metadata.geography;
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

  return Array.from(positionMap).map(function ([ positionKey, positionAssemblies ]) {
    return {
      position: JSON.parse(positionKey),
      icon: getIcon(positionAssemblies),
      onClick: onClick ? onClick.bind(null, positionAssemblies.map(_ => _.metadata.assemblyId)) : null,
      infoWindow: createInfoWindow ? createInfoWindow(positionAssemblies) : null,
    };
  });
}

export default {
  getMarkerDefinitions,
  standardMarkerIcon,
  resistanceMarkerIcon,
};
