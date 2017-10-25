const React = require('../node_modules/react');

const createClass = require('./create-class-shim');
const PropTypes = require('prop-types');

React.createClass = createClass;
React.PropTypes = PropTypes;

module.exports = React;
