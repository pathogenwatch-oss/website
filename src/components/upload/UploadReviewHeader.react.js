import React from 'react';

import FileUploadingProgress from './FileUploadingProgress.react';
import UploadButton from './navigation/UploadButton.react';

import DEFAULT from '^/defaults.js';

const headerStyle = {
  'background': '#fff',
  'color': DEFAULT.CGPS.COLOURS.PURPLE,
}

const activeAssemblyNameStyle = {
  marginRight: '100px',
  textTransform: 'uppercase',
  color: '#666',
  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
  fontSize: "16px",
  fontWeight: "500"
}

export default React.createClass({

  propTypes: {
    title: React.PropTypes.string.isRequired,
  },

  render() {
    return (
        <header style={headerStyle} className="mdl-layout__header">
          <div className="mdl-layout-icon"></div>
          <div style={headerStyle} className="mdl-layout__header-row">
            <span style={headerStyle} className="mdl-layout-title">{this.props.title} | {this.props.species}</span>
            <span className="mdl-layout-spacer" />
            <span style={activeAssemblyNameStyle} className="mdl-layout-title">{this.props.activeAssemblyName}</span>
            <UploadButton activateButton={this.props.activateUploadButton} uploadProgressPercentage={this.props.uploadProgressPercentage} isUploading={this.props.isUploading} />
          </div>
          <FileUploadingProgress />
        </header>
    );
  },

});
