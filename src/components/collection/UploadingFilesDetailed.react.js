import React from 'react';

import UploadingAssembliesProgress from './UploadingAssembliesProgress.react';

const UploadingFiles = React.createClass({

  componentDidMount() {
    componentHandler.upgradeDom();
  },

  render() {
    return (
      <div className="wgsa-upload-progress">
        <main className="wgsa-upload-progress-container">
          <div className="wgsa-collection-url-display card-style mdl-shadow--2dp">
            <div className="mdl-card__supporting-text">
              Final results will be available at the below URL, <br/>
              if upload fails to progress, please try this URL later.
            </div>
            <div className="mdl-card__supporting-text wgsa-collection-url">
              {this.props.collectionUrl || <div className="mdl-spinner mdl-js-spinner is-active"></div>}
            </div>
          </div>
          <UploadingAssembliesProgress />
        </main>
      </div>
    );
  },

});

module.exports = UploadingFiles;
