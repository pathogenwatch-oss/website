import React from 'react';
import { connect } from 'react-redux';

import Summary from '../Summary.react';
import DocumentTitle from '~/branding/DocumentTitle.react';
import ToggleErrors from './errors/Toggle.react';

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
          <div className="pw-upload-summary-column">
            <ToggleErrors />
            <p className="pw-upload-session-time">
              {formatDateTime(uploadedAt)}
            </p>
          </div>
        </Summary>
      </React.Fragment>
    );
  },
});

function mapStateToProps(state) {
  return {
    summary: upload.getStatusSummary(state),
    isUploading: upload.isUploading(state),
  };
}

export default connect(mapStateToProps)(Component);
