import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import Dashboard from './Dashboard.react';

import { subscribe } from '../../utils/Notification';
import Species from '../../species';

const UploadProgress = React.createClass({

  propTypes: {
    checkStatus: React.PropTypes.func,
    updateProgress: React.PropTypes.func,
    progress: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    metadata: React.PropTypes.object,
  },

  componentWillMount() {
    this.setDocumentTitle();
  },

  componentDidMount() {
    componentHandler.upgradeDom();
    this.props.checkStatus();
  },

  componentDidUpdate() {
    const { progress, updateProgress } = this.props;
    if (progress.collectionId && !this.notificationChannel) {
      this.notificationChannel = subscribe(
        progress.collectionId,
        'upload-progress',
        data => updateProgress(data)
      );
    }
    this.setDocumentTitle();
  },

  setDocumentTitle() {
    const { metadata = {}, percentage = 0 } = this.props;

    document.title = [
      'WGSA',
      '|',
      `(${percentage}%)`,
      `${metadata.title || 'Upload Progress'}`,
      `[${Species.current.name}]`,
    ].join(' ');
  },

  render() {
    return (
      <div className="wgsa-upload-progress">
        <main className="wgsa-upload-progress-container">
          <div className="wgsa-collection-url-display wgsa-upload-progress-section mdl-shadow--2dp">
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
