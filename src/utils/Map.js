import MapStylesUtils from '../utils/MapStyles';

const MARKER = {
  SIZE: {
    WIDTH: 12,
    HEIGHT: 12,
  },
  SHAPES: {
    CIRCLE: 'circle',
    SQUARE: 'square',
    STAR: 'star',
    TRIANGLE: 'triangle',
  },
};

function drawSquare(fillColour) {
  var canvas = document.createElement("canvas");
  canvas.width = MARKER.SIZE.WIDTH;
  canvas.height = MARKER.SIZE.HEIGHT;
  var context = canvas.getContext('2d');

  context.fillStyle = fillColour;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#000';
  context.strokeRect(0, 0, canvas.width, canvas.height);

  return canvas.toDataURL();
}

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
  context.lineWidth = 1;
  context.strokeStyle = '#000';
  context.stroke();

  return canvas.toDataURL();
}

function drawStar(fillColour) {
  var canvas = document.createElement("canvas");
  canvas.width = MARKER.SIZE.WIDTH;
  canvas.height = MARKER.SIZE.HEIGHT;
  var context = canvas.getContext('2d');
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var radius = MARKER.SIZE.WIDTH / 2 - 1;
  var numberOfPoints = 5;
  var fractionOfRadiusForInset = 0.5;

  context.beginPath();
  context.translate(centerX, centerY);
  context.moveTo(0, 0 - radius);
  for (var i = 0; i < numberOfPoints; i++) {
    context.rotate(Math.PI / numberOfPoints);
    context.lineTo(0, 0 - (radius * fractionOfRadiusForInset));
    context.rotate(Math.PI / numberOfPoints);
    context.lineTo(0, 0 - radius);
  }
  context.fillStyle = fillColour;
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = '#000';
  context.stroke();

  return canvas.toDataURL();
}

function drawTriangle(fillColour) {
  var canvas = document.createElement("canvas");
  canvas.width = MARKER.SIZE.WIDTH;
  canvas.height = MARKER.SIZE.HEIGHT;
  var context = canvas.getContext('2d');
  var topX = canvas.width / 2;
  var topY = 0;
  var height = MARKER.SIZE.WIDTH * (Math.sqrt(3)/2);

  context.beginPath();
  context.moveTo(topX, topY);
  context.lineTo(topX + height / 2, topY + height);
  context.lineTo(topX - height / 2, topY + height);
  context.lineTo(topX, topY);
  context.fillStyle = fillColour;
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = '#000';
  context.stroke();

  return canvas.toDataURL();
}

function getMarkerIcon(shape, fillColour) {
  shape = shape.toLowerCase();

  if (shape === 'square') {
    return drawSquare(fillColour);
  } else if (shape === 'circle') {
    return drawCircle(fillColour);
  } else if (shape === 'star') {
    return drawStar(fillColour);
  } else if (shape === 'triangle') {
    return drawTriangle(fillColour);
  } else {
    throw new Error("Can't draw this shape: " + shape + ". I can draw: 'square', 'circle', 'star' and 'triangle'.");
  }
}

function isNewDataObjectPositionGroup(DataObjectPositionGroup) {
  return (typeof DataObjectPositionGroup === 'undefined');
}

function groupDataObjectsByPosition(dataObjects) {
  var dataObjectIds = Object.keys(dataObjects);
  var dataObjectsGroupedByPosition = {};
  var dataObjectPositionKey;
  var dataObjectPositionGroup;
  var dataObject;
  var latitude;
  var longitude;

  dataObjectIds.forEach(function (dataObjectId) {
    dataObject = dataObjects[dataObjectId];

    if (isDataObjectHasCoordinates(dataObject)) {

      latitude = dataObject.__latitude;
      longitude = dataObject.__longitude;

      dataObjectPositionKey = this.getPositionKey(latitude, longitude);
      dataObjectPositionGroup = dataObjectsGroupedByPosition[dataObjectPositionKey];

      if (isNewDataObjectPositionGroup(dataObjectPositionGroup)) {
        dataObjectsGroupedByPosition[dataObjectPositionKey] = [ dataObject ];
      } else {
        dataObjectsGroupedByPosition[dataObjectPositionKey].push(dataObject);
      }
    }
  }.bind(this));

  return dataObjectsGroupedByPosition;
}

function getPositionKey(latitude, longitude) {
  return (latitude + ',' + longitude);
}

function isDataObjectHasLatitude(dataObject) {
  return (typeof dataObject.__latitude !== 'undefined' && dataObject.__latitude !== '');
}

function isDataObjectHasLongitude(dataObject) {
  return (typeof dataObject.__longitude !== 'undefined' && dataObject.__longitude !== '');
}

function isDataObjectHasCoordinates(dataObject) {
  return (isDataObjectHasLatitude(dataObject) && isDataObjectHasLongitude(dataObject));
}

function getDataObjectsWithCoordinates(dataObjects) {
  var dataObjectIds = Object.keys(dataObjects);
  var dataObjectWithCoordinates = [];
  var dataObject;

  dataObjectIds.forEach(function (dataObjectId) {
    dataObject = dataObjects[dataObjectId];

    if (isDataObjectHasCoordinates(dataObject)) {
      dataObjectWithCoordinates.push(dataObject);
    }
  });

  return dataObjectWithCoordinates;
}

module.exports = {
  getPositionKey: getPositionKey,
  getDataObjectsWithCoordinates: getDataObjectsWithCoordinates,
  isDataObjectHasCoordinates: isDataObjectHasCoordinates,
  groupDataObjectsByPosition: groupDataObjectsByPosition,
  getMarkerIcon: getMarkerIcon,
  STYLES: MapStylesUtils,
};
