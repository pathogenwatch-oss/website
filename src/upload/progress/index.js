import React from 'react';
import { connect } from 'react-redux';

import Progress from './Progress.react';
import Summary from './Summary.react';
import Recovery from './recovery/Recovery.react';

import { isUploadPending } from './files/selectors';
import {
  isSpecieationComplete,
  getProgressView,
  getUploadedAt,
} from './selectors';

import { processFiles } from './files/actions';

import { fetchGenomes } from './actions';

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

  renderContent() {
    const { match } = this.props;
    if (match.params.uploadedAt !== this.props.uploadedAt) {
      return null;
    }
    switch (this.props.view) {
      case views.RECOVERY:
        return <Recovery uploadedAt={this.props.uploadedAt} />;
      case views.PROGRESS:
        return <Progress uploadedAt={this.props.uploadedAt} />;
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
