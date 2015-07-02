/*

## How layout works

The layout is divided into 5 containers:
1. West
2. Middle
3. East
4. North
5. South

North container encapsulates West and East containers:
+ North
  + West
  + Middle
  + East
+ South

Every container's size is calculated based on current viewport size.

North and West are primary containers. Their sizes are calculated relative to
a viewport size.

Middle, South and East are secondary containers. Their sizes are calculated based on
North and West container sizes.

*/

var DEFAULT = require('../defaults');

var DIVIDER_THICKNESS = 24;
var DIVIDER_BORDER_THICKNESS = 2;
var NUMBER_OF_BORDERS_PER_DIVIDER = 2;
var NUMBER_OF_CONTAINERS_INSIDE_OF_NORTH_CONTAINER = 3;
var NORTH_SOUTH_CONTAINERS_RATIO = 1.45;

function getDividerSize() {
  return (DIVIDER_THICKNESS + DIVIDER_BORDER_THICKNESS * NUMBER_OF_BORDERS_PER_DIVIDER);
}

function getViewportWidth() {
  return $(window).width();
}

function getViewportHeight() {
  return $(window).height();
}

function getNumberOfDividers() {
  return NUMBER_OF_CONTAINERS_INSIDE_OF_NORTH_CONTAINER - 1;
}

function getAvailableWidth() {
  return (getViewportWidth() - (getDividerSize() * getNumberOfDividers()));
}

function getAvailableHeight() {
  return (getViewportHeight() - getNorthSouthDividerWidth());
}

// West

function getWestWidth() {
  return (getAvailableWidth() / NUMBER_OF_CONTAINERS_INSIDE_OF_NORTH_CONTAINER);
}

function getWestMiddleDividerLeft() {
  return getWestWidth();
}

// Middle

function getMiddleLeft() {
  return (getWestWidth() + getDividerSize());
}

function getMiddleWidth() {
  return (getAvailableWidth() / NUMBER_OF_CONTAINERS_INSIDE_OF_NORTH_CONTAINER);
}

// East

function getMiddleEastDividerLeft() {
  return (getMiddleLeft() + getMiddleWidth());
}

function getEastLeft() {
  return (getMiddleEastDividerLeft() + getDividerSize());
}

function getEastWidth() {
  return (getAvailableWidth() / NUMBER_OF_CONTAINERS_INSIDE_OF_NORTH_CONTAINER);
}

// North

function getNorthHeight() {
  return (getViewportHeight() / NORTH_SOUTH_CONTAINERS_RATIO);
}

function getNorthSouthDividerTop() {
  return getNorthHeight();
}

// South

function getSouthTop() {
  return (getNorthHeight() + getDividerSize());
}

function getSouthHeight() {
  return (getViewportHeight() - getSouthTop());
}

module.exports = {

  DIVIDER_THICKNESS: DIVIDER_THICKNESS,
  DIVIDER_BORDER_THICKNESS: DIVIDER_BORDER_THICKNESS,

  getDividerSize: getDividerSize,

  getViewportWidth: getViewportWidth,
  getViewportHeight: getViewportHeight,

  // West

  getWestWidth: getWestWidth,

  // West Middle Divider

  getWestMiddleDividerLeft: getWestMiddleDividerLeft,

  // Middle

  getMiddleLeft: getMiddleLeft,
  getMiddleWidth: getMiddleWidth,

  // Middle East

  getMiddleEastDividerLeft: getMiddleEastDividerLeft,

  // East

  getEastLeft: getEastLeft,
  getEastWidth: getEastWidth,

  // North

  getNorthHeight: getNorthHeight,

  // North South

  getNorthSouthDividerTop: getNorthSouthDividerTop,

  // South

  getSouthTop: getSouthTop,
  getSouthHeight: getSouthHeight
};
