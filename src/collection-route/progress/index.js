import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import Dashboard from './Dashboard.react';

import { subscribe, unsubscribe } from '../../utils/Notification';

const UploadProgress = React.createClass({

  propTypes: {
    updateProgress: React.PropTypes.func,
    progress: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    metadata: React.PropTypes.object,
  },

  componentWillMount() {
    this.subscribeToNotifications();
    this.setDocumentTitle();
  },

  componentDidMount() {
    componentHandler.upgradeDom();
  },

  componentDidUpdate() {
    this.setDocumentTitle();
  },

  componentWillUnmount() {
    unsubscribe(this.props.collection.uuid, 'progress');
  },

  setDocumentTitle() {
    const { collection, percentage = 0 } = this.props;
    const { metadata = {} } = collection;
    document.title = [
      'WGSA',
      '|',
      `(${percentage}%)`,
      `${metadata.title || 'Upload Progress'}`,
    ].join(' ');
  },

  subscribeToNotifications() {
    const { collection, updateProgress } = this.props;
    if (collection.progress && !this.notificationChannel) {
      this.notificationChannel = subscribe(
        collection.uuid, // get collection id from url
        'progress',
        updateProgress
      );
    }
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
          <Dashboard {...this.props.collection.progress} />
        </main>
      </div>
    );
  },

});

export default connect()(UploadProgress);
