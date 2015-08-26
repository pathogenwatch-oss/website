var React = require('react');
var UploadButton = require('./navigation/UploadButton.react');
var Logo = require('../Logo.react.js');
var DEFAULT = require('../../defaults.js');

var headerStyle = {
  'background': '#fff',
   color: DEFAULT.CGPS.COLOURS.PURPLE
};

var UploadReviewHeader = React.createClass({

  propTypes: {
    title: React.PropTypes.string.isRequired
  },

  componentDidMount: function() {
    componentHandler.upgradeDom();
  },

  render: function () {
    return (
      <header style={headerStyle} className="mdl-layout__header">
        <div className="mdl-layout-icon"></div>
        <div style={headerStyle} className="mdl-layout__header-row">
          <span style={headerStyle} className="mdl-layout-title">{this.props.title}</span>
          <UploadButton activateButton={this.props.activateUploadButton} />
        </div>
      </header>
    );
  }
});

module.exports = UploadReviewHeader;

