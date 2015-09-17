import React from 'react';

import FileUploadingProgress from './FileUploadingProgress.react';
import UploadingAssembliesProgress from './UploadingAssembliesProgress.react';

const UploadingFiles = React.createClass({

  render() {
    return (
      <div className="wgsa-upload-progress">
        <FileUploadingProgress />
          <main className="wgsa-upload-progress-container">
            <UploadingAssembliesProgress />
          </main>
      </div>
    );
  },

});

module.exports = UploadingFiles;
