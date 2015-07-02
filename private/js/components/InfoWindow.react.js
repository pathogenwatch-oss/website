var React = require('react');
var InfoWindowIsolate = require('./InfoWindowIsolate.react');
var DataUtils = require('../utils/Data');

var InfoWindow = React.createClass({
  getInfoWindowIsolateElement: function (isolate) {
    var isolateId = DataUtils.getDataObject__Id(isolate);

    return (
      <InfoWindowIsolate
        isolate={isolate}
        handleIsolateClick={this.props.handleIsolateClick}
        key={isolateId} />
    );
  },

  render: function () {
    var isolates = this.props.isolates;
    var isolateElements = isolates.map(this.getInfoWindowIsolateElement);

    var listStyle = {
      listStyle: 'none',
      padding: 0
    };

    return (
      <ul style={listStyle}>{isolateElements}</ul>
    );
  }
});

module.exports = InfoWindow;
