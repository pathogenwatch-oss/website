var React = require('react');
var DataUtils = require('../utils/Data');

var InfoWindow = React.createClass({
  render: function () {
    var isolate = this.props.isolate;
    var isolate__Id = DataUtils.getDataObject__Id(isolate);
    var isolateId = DataUtils.getDataObjectId(isolate);

    var linkStyle = {
      lineHeight: '1.7em'
    };

    return (
      <li>
        <a href="#"
          style={linkStyle}
          data-info-window-isolate
          data-info-window-isolate-id={isolate__Id}>{isolateId}</a>
      </li>
    );
  }
});

module.exports = InfoWindow;
