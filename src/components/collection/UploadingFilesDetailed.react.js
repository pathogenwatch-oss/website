import React from 'react';

import FileUploadingProgress from './FileUploadingProgress.react';
import UploadingAssembliesProgress from './UploadingAssembliesProgress.react';

const layoutStyle = {
  alignItems: 'center',
  justifyContent: 'center',
};

const contentStyle = {
  maxWidth: '960px',
  textAlign: 'center',
  flexGrow: 0,
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

  render() {
    return (
      <div>
          <h2 style={headerStyle}><span style={featureStyle}>Uploading</span> and <span style={featureStyle}>analysing</span> your files.</h2>
          <FileUploadingProgress />
          <UploadingAssembliesProgress />
      </div>
    );
  },

});

module.exports = UploadingFiles;
