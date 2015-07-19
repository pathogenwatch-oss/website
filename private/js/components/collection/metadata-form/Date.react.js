var React = require('react');

var MetadataYearInput = require('./Year.react');
var MetadataMonthInput = require('./Month.react');
var MetadataDayInput = require('./Day.react');

var fullWidthAndHeightStyle = {
  width: '100%',
  height: '100%'
};

var Component = React.createClass({
  render: function () {
    return (
      <div>
        <MetadataYearInput />
        <MetadataMonthInput />
        <MetadataDayInput />
      </div>
    );
  }
});

module.exports = Component;
