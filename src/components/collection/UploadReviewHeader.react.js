import React from 'react';

import FileUploadingProgress from './FileUploadingProgress.react';
import UploadButton from './navigation/UploadButton.react';

import DEFAULT from '../../defaults.js';

const headerStyle = {
  'background': '#fff',
  color: DEFAULT.CGPS.COLOURS.PURPLE,
  position: 'relative',
};

export default React.createClass({

  propTypes: {
    title: React.PropTypes.string.isRequired,
  },

  render() {
    return (
        <header style={headerStyle} className="mdl-layout__header">
          <div className="mdl-layout-icon"></div>
          <div style={headerStyle} className="mdl-layout__header-row">
            <span style={headerStyle} className="mdl-layout-title">{this.props.title}</span>
            <UploadButton activateButton={this.props.activateUploadButton} isUploading={this.props.isUploading} />
          </div>
          <FileUploadingProgress />
        </header>
    );
  },

});
