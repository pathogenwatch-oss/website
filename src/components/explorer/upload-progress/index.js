import '^/css/upload-progress.css';

import React from 'react';

import Header from './Header.react';
import Dashboard from './Dashboard.react';

import FileUploadingStore from '^/stores/FileUploadingStore';

import { CGPS } from '^/defaults';

const layoutContentStyle = {
  background: CGPS.COLOURS.GREY_LIGHT,
  position: 'relative',
};

const UploadProgress = React.createClass({

  propTypes: {
    checkStatus: React.PropTypes.func,
    progress: React.PropTypes.object,
    isUploading: React.PropTypes.bool,
  },

  componentDidMount() {
    componentHandler.upgradeDom();

    this.props.checkStatus();

    if (this.props.isUploading) {
      FileUploadingStore.uploadFiles();
    }
  },

  componentDidUpdate(previousProps) {
    if (previousProps.progress !== this.props.progress) {
      setTimeout(this.props.checkStatus, 3000);
    }
  },

  render() {
    const { receivedResults, expectedResults, ...dashboardProps } = this.props.progress;
    const percentage = expectedResults ? Math.floor(receivedResults / expectedResults * 100) : 0;
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <Header percentage={percentage} />
        <main className="mdl-layout__content" style={layoutContentStyle}>
          <div className="wgsa-upload-progress">
            <main className="wgsa-upload-progress-container">
              <div className="wgsa-collection-url-display wgsa-card mdl-shadow--2dp">
                <div className="mdl-card__supporting-text">
                  Final results will be available at the above address. <br/>
                  If upload fails to progress, please refresh at a later time.
                </div>
              </div>
              <Dashboard {...dashboardProps}
                isUploading={this.props.isUploading}
              />
            </main>
          </div>
        </main>
      </div>
    );
  },

});

export default UploadProgress;
