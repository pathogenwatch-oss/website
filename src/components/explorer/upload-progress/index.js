import '^/css/upload-progress.css';

import React from 'react';
import { connect } from 'react-redux';

import Dashboard from './Dashboard.react';

import { subscribe } from '^/utils/Notification';

const UploadProgress = React.createClass({

  propTypes: {
    checkStatus: React.PropTypes.func,
    updateProgress: React.PropTypes.func,
    progress: React.PropTypes.object,
    isUploading: React.PropTypes.bool,
    dispatch: React.PropTypes.func,
  },

  componentWillMount() {
    document.title = 'WGSA | Upload Progress';
  },

  componentDidMount() {
    componentHandler.upgradeDom();
    this.props.checkStatus();
  },

  componentDidUpdate() {
    if (this.props.progress.collectionId && !this.notificationChannel) {
      this.notificationChannel = subscribe(
        this.props.progress.collectionId,
        'upload-progress',
        data => this.props.updateProgress(data)
      );
    }
  },

  render() {
    return (
      <div className="wgsa-upload-progress">
        <main className="wgsa-upload-progress-container">
          <div className="wgsa-collection-url-display wgsa-card mdl-shadow--2dp">
            <div className="mdl-card__supporting-text">
              Final results will be available at the current address.<br />
              If upload fails to progress, please refresh at a later time.
            </div>
          </div>
          <Dashboard {...this.props.progress} />
        </main>
      </div>
    );
  },

});

export default connect()(UploadProgress);
