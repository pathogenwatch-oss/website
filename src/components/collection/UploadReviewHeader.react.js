import React from 'react';

import FileUploadingProgress from './FileUploadingProgress.react';
import UploadButton from './navigation/UploadButton.react';

import DEFAULT from '../../defaults.js';

const headerStyle = {
  'background': '#fff',
  color: DEFAULT.CGPS.COLOURS.PURPLE,
}

const activeAssemblyNameStyle = {
  'float': 'right',
  'position': 'absolute',
  'padding': '18px',
  'right': '100px',
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
            <span style={activeAssemblyNameStyle} className="mdl-layout-title">{this.props.activeAssemblyName}</span>
            <UploadButton activateButton={this.props.activateUploadButton} uploadProgressPercentage={this.props.uploadProgressPercentage} isUploading={this.props.isUploading} />
          </div>
          <FileUploadingProgress />
        </header>
    );
  },

});
