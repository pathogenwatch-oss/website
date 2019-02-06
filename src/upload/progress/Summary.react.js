import React from 'react';
import { connect } from 'react-redux';

import Summary from '../Summary.react';
import ErrorSummary from './ErrorSummary.react';

import * as upload from './selectors';
import DocumentTitle from '../../branding/DocumentTitle.react';

const Component = React.createClass({
  getTitle() {
    const { summary } = this.props;
    return [
      summary.total ? `(${summary.completed}/${summary.total})` : '',
      'Upload',
    ].join(' ');
  },

  renderContent() {
    const { isUploading, summary, uploadedAt } = this.props;

    const uploadedAtDisplay = (
      <p style={{ marginLeft: 'auto' }}>
        Uploaded <strong>{new Date(uploadedAt).toLocaleString()}</strong>
      </p>
    );

    if (!isUploading && summary.errored) {
      return <ErrorSummary>{uploadedAtDisplay}</ErrorSummary>;
    }

    return <Summary>{uploadedAtDisplay}</Summary>;
  },

  render() {
    return (
      <React.Fragment>
        <DocumentTitle>{this.getTitle()}</DocumentTitle>
        {this.renderContent()}
      </React.Fragment>
    );
  },
});

function mapStateToProps(state) {
  return {
    summary: upload.getFileSummary(state),
    isUploading: upload.isUploading(state),
  };
}

export default connect(mapStateToProps)(Component);
