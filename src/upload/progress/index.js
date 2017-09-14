import React from 'react';
import { connect } from 'react-redux';

import Progress from './Progress.react';
import Summary from './Summary.react';

import { getUploadedFileList, isUploadPending, isSpecieationComplete } from './selectors';

import { receiveUploadAnalysis, fetchGenomes, processFiles } from './actions';

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
  },

  componentWillUnmount() {
    unsubscribe(config.clientId);
  },

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
    hasFiles: getUploadedFileList(state).length > 0,
  };
}

function mapDispatchToProps(dispatch, { match }) {
  const { uploadedAt } = match.params;
  return {
    receiveAnalysis: msg => dispatch(receiveUploadAnalysis(msg)),
    fetch: () => dispatch(fetchGenomes(uploadedAt)),
    startUpload: () => dispatch(processFiles()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
