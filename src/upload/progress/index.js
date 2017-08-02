import React from 'react';
import { connect } from 'react-redux';

import Progress from './Progress.react';
import Summary from './Summary.react';

import { getUploadedGenomeList } from './selectors';

import { receiveUploadAnalysis, fetchGenomes, processFiles } from './actions';

import { subscribe, unsubscribe } from '../../utils/Notification';

import config from '../../app/config';

const Component = React.createClass({

  componentWillMount() {
    subscribe(config.clientId, 'analysis', this.props.receiveAnalysis)
      .then(() => {
        const { hasFiles, startUpload, fetch, uploadedAt } = this.props;
        if (hasFiles) {
          startUpload();
        } else {
          fetch(uploadedAt);
        }
      });
  },

  componentWillUnmount() {
    unsubscribe(config.clientId);
  },

  render() {
    return (
      <div className="wgsa-hipster-style wgsa-filterable-view">
        <Summary uploadedAt={this.props.uploadedAt} />
        <Progress />
      </div>
    );
  },

});

function mapStateToProps(state, { match }) {
  const { uploadedAt } = match.params;
  return {
    uploadedAt,
    hasFiles: getUploadedGenomeList(state).length > 0,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    receiveAnalysis: msg => dispatch(receiveUploadAnalysis(msg)),
    fetch: uploadedAt => dispatch(fetchGenomes(uploadedAt)),
    startUpload: () => dispatch(processFiles()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
