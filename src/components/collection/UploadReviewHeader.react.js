var React = require('react');
var UploadButton = require('./navigation/UploadButton.react');
var Logo = require('../Logo.react.js');
var DEFAULT = require('../../defaults.js');

var headerStyle = {
  'background': DEFAULT.CGPS.COLOURS.GREY,
   color: DEFAULT.CGPS.COLOURS.PURPLE
};

var UploadReviewHeader = React.createClass({

  propTypes: {
    title: React.PropTypes.string.isRequired
  },

  render: function () {
    return (
      <header style={headerStyle} className="mdl-layout__header">
        <div style={headerStyle} className="mdl-layout__header-row">
          <Logo/>
          <span style={headerStyle} className="mdl-layout-title">{this.props.title}</span>
          <UploadButton />
        </div>
      </header>
    );
  }
});

module.exports = UploadReviewHeader;

