import React from 'react';

import UploadingAssembliesProgress from './UploadingAssembliesProgress.react';

const UploadingFiles = React.createClass({

  render() {
    return (
      <div className="wgsa-upload-progress">
        <main className="wgsa-upload-progress-container">
          <UploadingAssembliesProgress />
        </main>
      </div>
    );
  },

});

module.exports = UploadingFiles;
