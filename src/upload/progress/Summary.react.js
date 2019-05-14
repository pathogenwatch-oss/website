import React from 'react';
import { connect } from 'react-redux';

import Summary from '../Summary.react';
import DocumentTitle from '~/branding/DocumentTitle.react';
import Fade from '~/components/fade';

import * as upload from './files/selectors';

import { toggleErrors } from './actions';

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
    const { uploadedAt, isUploading, numFailed } = this.props;
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
            <Fade>
              {numFailed > 0 && (
                <button
                  className="pw-pill pw-pill-danger pw-uppercase"
                  onClick={this.props.toggleFailures}
                >
                  {numFailed} problem{numFailed === 1 ? '' : 's'}
                </button>
              )}
            </Fade>
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
    numFailed: upload.getNumFailedUploads(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleFailures: () => dispatch(toggleErrors()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
