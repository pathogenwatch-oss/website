import React from 'react';
import assign from 'object-assign';

import FileUploadingProgress from './FileUploadingProgress.react';
import UploadingAssembliesProgress from './UploadingAssembliesProgress.react';

const fullWidthAndHeightStyle = {
  width: '100%',
  height: '100%',
};

const dropZoneStyle = {
  textAlign: 'center',
};

const headerStyle = {
  fontWeight: '300',
  fontSize: '20px',
  textShadow: '1px 1px #fff',
};

const featureStyle = {
  fontWeight: 'bold',
};

const UploadingFiles = React.createClass({

  componentDidMount() {
    componentHandler.upgradeElement(React.findDOMNode(this.refs.spinner));
  },

  render() {
    return (
      <div className="mdl-layout mdl-js-layout">
        <main className="mdl-layout__content">
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--12-col" style={dropZoneStyle}>
              <div ref="spinner" className="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>
              <h2 style={headerStyle}><span style={featureStyle}>Uploading</span> and <span style={featureStyle}>analysing</span> your files.</h2>
              <FileUploadingProgress />
              <UploadingAssembliesProgress />
            </div>
          </div>
        </main>
      </div>
    );
  },

});

module.exports = UploadingFiles;
