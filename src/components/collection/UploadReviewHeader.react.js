var React = require('react');
var UploadButton = require('./navigation/UploadButton.react');
var Logo = require('../Logo.react.js');
var DEFAULT = require('../../defaults.js');

var headerStyle = {
  'background': '#fff',
   color: DEFAULT.CGPS.COLOURS.PURPLE
};

var loadingAnimationStyle = {
  visibility: 'visible',
  zIndex: -1
};

var UploadReviewHeader = React.createClass({

  propTypes: {
    title: React.PropTypes.string.isRequired
  },

  render: function () {
    loadingAnimationStyle.visibility = this.props.isProcessing ? 'visible' : 'hidden';

    return (
      <header style={headerStyle} className="mdl-layout__header">
        <div className="mdl-layout-icon"></div>
        <div style={headerStyle} className="mdl-layout__header-row">
          <span style={headerStyle} className="mdl-layout-title">{this.props.title}</span>
          <UploadButton activateButton={this.props.activateUploadButton} isUploading={this.props.isUploading} />
        </div>
        <div id="loadingAnimation" style={loadingAnimationStyle} className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
      </header>
    );
  }
});

module.exports = UploadReviewHeader;
