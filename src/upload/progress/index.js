import React from 'react';
import { connect } from 'react-redux';

import Progress from './Progress.react';
import Summary from './Summary.react';

import {
  getUploadedFileList,
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
    const { hasFiles, startUpload, fetch } = this.props;
    if (hasFiles) {
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

    if (this.props.isAnalysisComplete && this.interval) {
      clearInterval(this.interval);
      return;
    }

    const { position } = this.props;
    if (uploadComplete && previous.position !== position && position > 0) {
      this.poll();
      return;
    }

    if (this.props.lastMessageReceived !== previous.lastMessageReceived) {
      this.poll();
    }
  },

  componentWillUnmount() {
    unsubscribe(config.clientId);
  },

  poll() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(this.props.fetchPosition, 60000);
  },

  interval: null,

  render() {
    return (
      <div className="wgsa-hipster-style wgsa-filterable-view">
        <Summary />
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
    hasFiles: getUploadedFileList(state).length > 0,
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
