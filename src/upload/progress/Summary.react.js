import React from 'react';
import { connect } from 'react-redux';

import Summary from '../Summary.react';
// import ErrorSummary from './ErrorSummary.react';
import DocumentTitle from '~/branding/DocumentTitle.react';

import * as upload from './files/selectors';

import { formatDateTime } from '~/utils/Date';

const Component = React.createClass({
  getTitle() {
    const { summary } = this.props;
    return [
      summary.total ? `(${summary.completed}/${summary.total})` : '',
      'Upload',
    ].join(' ');
  },

  render() {
    const { uploadedAt, isUploading } = this.props;
    return (
      <React.Fragment>
        <DocumentTitle>{this.getTitle()}</DocumentTitle>
        <Summary>
          {!isUploading && (
            <a className="mdl-button" onClick={() => window.history.back()}>
              <i className="material-icons">arrow_back</i> Go back
            </a>
          )}
          <p className="pw-upload-session-time pw-pill pw-pill-purple">
            {formatDateTime(uploadedAt)}
          </p>
        </Summary>
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
