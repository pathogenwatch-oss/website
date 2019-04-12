import React from 'react';
import { connect } from 'react-redux';

import Summary from '../Summary.react';
// import ErrorSummary from './ErrorSummary.react';

import * as upload from './files/selectors';
import DocumentTitle from '~/branding/DocumentTitle.react';

const Component = React.createClass({
  getTitle() {
    const { summary } = this.props;
    return [
      summary.total ? `(${summary.completed}/${summary.total})` : '',
      'Upload',
    ].join(' ');
  },

  render() {
    return (
      <React.Fragment>
        <DocumentTitle>{this.getTitle()}</DocumentTitle>
        <Summary uploadedAt={this.props.uploadedAt} />
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
