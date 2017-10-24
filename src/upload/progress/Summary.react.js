import React from 'react';
import { connect } from 'react-redux';

import Summary from '../Summary.react';
import ErrorSummary from './ErrorSummary.react';

import * as upload from './selectors';

const Component = createClass({

  componentDidMount() {
    document.title = 'WGSA | Upload';
  },

  componentDidUpdate() {
    const { summary } = this.props;
    document.title = [
      'WGSA',
      '|',
      summary.total ? `(${summary.completed}/${summary.total})` : '',
      'Upload',
    ].join(' ');
  },

  render() {
    const { isUploading, summary } = this.props;

    if (!isUploading && summary.errored) {
      return <ErrorSummary />;
    }

    return <Summary />;
  },

});

function mapStateToProps(state) {
  return {
    summary: upload.getFileSummary(state),
    isUploading: upload.isUploading(state),
  };
}

export default connect(mapStateToProps)(Component);
