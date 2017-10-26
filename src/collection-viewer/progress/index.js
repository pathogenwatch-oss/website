import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import removeMarkdown from 'remove-markdown';

import Dashboard from './Dashboard.react';
import Errors from './Errors.react';

import { getProgressPercentage, getPosition } from './selectors.js';

import { fetchPosition } from '../actions';

import { subscribe, unsubscribe } from '../../utils/Notification';

const UploadProgress = React.createClass({

  propTypes: {
    updateProgress: React.PropTypes.func,
    progress: React.PropTypes.object,
    metadata: React.PropTypes.object,
  },

  componentWillMount() {
    this.subscribeToNotifications();
    this.setDocumentTitle();
  },

  componentDidMount() {
    componentHandler.upgradeDom();
  },

  componentDidUpdate(previous) {
    this.setDocumentTitle();
    const { collection, position } = this.props;

    if (position === 0) {
      this.stopPolling();
      return;
    }

    if (!previous.collection.progress && collection.progress) {
      this.fetchPosition();
    }
  },

  componentWillUnmount() {
    unsubscribe(this.props.collection.uuid, 'progress');
    this.stopPolling();
  },

  setDocumentTitle() {
    const { collection, percentage = 0 } = this.props;
    const { title } = collection;
    const sanitisedTitle = title ? removeMarkdown(title) : 'Analysis Progress';
    document.title = [
      'WGSA',
      '|',
      `(${percentage}%)`,
      `${sanitisedTitle}`,
    ].join(' ');
  },

  subscribeToNotifications() {
    const { collection, updateProgress } = this.props;
    if (collection.uuid && !this.notificationChannel) {
      this.notificationChannel = subscribe(
        collection.uuid, // get collection id from url
        'progress',
        updateProgress
      );
    }
    this.fetchPosition();
  },

  fetchPosition() {
    const { collection } = this.props;
    if (collection.progress) {
      const { started } = collection.progress;
      this.props.fetchPosition(started).then(this.poll);
    }
  },

  poll() {
    const { collection } = this.props;
    if (collection.progress) {
      const { started } = collection.progress;
      this.stopPolling();
      this.interval = setInterval(
        () => this.props.fetchPosition(started),
        30 * 1000
      );
    }
  },

  stopPolling() {
    if (this.interval) clearInterval(this.interval);
  },

  render() {
    const { position, collection } = this.props;
    const { progress = {} } = collection;
    const { errors = [], results = {} } = progress;
    return (
      <div className="wgsa-collection-progress">
        <main className="wgsa-collection-progress-container">
          <div className="wgsa-collection-url-display wgsa-collection-progress-section">
            <p className="mdl-card__supporting-text">
              Final results will be available at the current address.<br />
              If upload fails to progress, please refresh at a later time.
            </p>
            { position !== null &&
              <p className="mdl-card__supporting-text">
                { position === 0 ?
                  <strong>Results processing.</strong> :
                  <strong>
                    {position} job{position === 1 ? '' : 's'} till next result.
                  </strong> }
              </p> }
          </div>
          <Dashboard results={results} />
          { errors.length ?
            <div className="wgsa-collection-progress-section mdl-cell mdl-cell--12-col">
              <div className="wgsa-card-heading">Warnings</div>
              <Errors errors={errors} />
            </div> : null
          }
        </main>
      </div>
    );
  },

});

function mapStateToProps(state) {
  return {
    percentage: getProgressPercentage(state),
    position: getPosition(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPosition: started => dispatch(fetchPosition(started)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadProgress);
