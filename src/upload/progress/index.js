import React from 'react';
import { connect } from 'react-redux';

import Progress from './Progress.react';
import Summary from './Summary.react';

import {
  isUploadPending,
  isSpecieationComplete,
  getQueuePosition,
  getLastMessageReceived,
  isAnalysisComplete,
} from './selectors';

import {
  receiveUploadAnalysis,
  fetchGenomes,
  processFiles,
  fetchQueuePosition,
} from './actions';

import { subscribe, unsubscribe } from '../../utils/Notification';

import config from '../../app/config';

const Component = React.createClass({

  componentWillMount() {
    const { uploadedAt } = this.props;
    subscribe(config.clientId, `analysis-${uploadedAt}`, this.props.receiveAnalysis);
    const { isUploading, startUpload, fetch } = this.props;
    if (isUploading) {
      startUpload();
    } else {
      fetch();
    }
  },

  componentDidUpdate(previous) {
    const uploadComplete = (previous.isUploading && !this.props.isUploading);
    const specieationComplete = (previous.isSpecieationComplete === false && this.props.isSpecieationComplete);
    if (uploadComplete || specieationComplete) {
      this.props.fetch();
    }

    if (this.props.isAnalysisComplete) {
      this.stopPolling();
      return;
    }

    const { position } = this.props;
    if (!previous.uploadComplete && uploadComplete && position > 0) {
      this.poll();
    }

    if (previous.position !== position && position > 0) {
      this.poll();
    }

    if (this.props.lastMessageReceived !== previous.lastMessageReceived) {
      this.poll();
    }
  },

  componentWillUnmount() {
    unsubscribe(config.clientId);
    this.stopPolling();
  },

  poll() {
    this.stopPolling();
    this.interval = setInterval(this.props.fetchPosition, 60000);
  },

  stopPolling() {
    if (this.interval) clearInterval(this.interval);
  },

  interval: null,

  render() {
    return (
      <div className="wgsa-hipster-style">
        <Summary uploadedAt={this.props.uploadedAt} />
        <Progress uploadedAt={this.props.uploadedAt} />
      </div>
    );
  },

});

function mapStateToProps(state, { match }) {
  const { uploadedAt } = match.params;
  return {
    uploadedAt,
    isUploading: isUploadPending(state),
    isSpecieationComplete: isSpecieationComplete(state),
    isAnalysisComplete: isAnalysisComplete(state),
    position: getQueuePosition(state),
    lastMessageReceived: getLastMessageReceived(state),
  };
}

function mapDispatchToProps(dispatch, { match }) {
  const { uploadedAt } = match.params;
  return {
    receiveAnalysis: msg => dispatch(receiveUploadAnalysis(msg)),
    fetch: () => dispatch(fetchGenomes(uploadedAt)),
    fetchPosition: () => dispatch(fetchQueuePosition(uploadedAt)),
    startUpload: () => dispatch(processFiles()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
