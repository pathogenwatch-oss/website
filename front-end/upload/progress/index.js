import React from 'react';
import { connect } from 'react-redux';

import Progress from './Progress.react';
import Summary from './Summary.react';
import Recovery from './recovery';

import { isUploadPending } from './files/selectors';
import {
  isSpecieationComplete,
  getProgressView,
  getUploadedAt,
} from './selectors';

import { processFiles } from './files/actions';

import { fetchGenomes, resetUpload } from './actions';

import { views } from '../constants';

const Component = React.createClass({
  componentWillMount() {
    const { isUploading, startUpload, fetch } = this.props;
    if (isUploading) {
      startUpload();
    } else {
      fetch();
    }
  },

  componentDidUpdate(previous) {
    const uploadComplete = previous.isUploading && !this.props.isUploading;
    const specieationComplete =
      previous.isSpecieationComplete === false &&
      this.props.isSpecieationComplete;

    if (uploadComplete || specieationComplete) {
      this.props.fetch();
    }
  },

  componentWillUnmount() {
    this.props.reset();
  },

  renderContent() {
    const { match, uploadedAt } = this.props;
    if (match.params.uploadedAt !== uploadedAt) {
      return null;
    }
    switch (this.props.view) {
      case views.RECOVERY:
        return <Recovery uploadedAt={uploadedAt} />;
      case views.PROGRESS:
        return <Progress uploadedAt={uploadedAt} />;
      default:
        return null;
    }
  },

  render() {
    return (
      <React.Fragment>
        <Summary uploadedAt={this.props.uploadedAt} />
        {this.renderContent()}
      </React.Fragment>
    );
  },
});

function mapStateToProps(state) {
  return {
    uploadedAt: getUploadedAt(state),
    isUploading: isUploadPending(state),
    isSpecieationComplete: isSpecieationComplete(state),
    view: getProgressView(state),
  };
}

function mapDispatchToProps(dispatch, { match }) {
  const { uploadedAt } = match.params;
  return {
    fetch: () => dispatch(fetchGenomes(uploadedAt)),
    startUpload: () => dispatch(processFiles()),
    reset: () => dispatch(resetUpload()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
