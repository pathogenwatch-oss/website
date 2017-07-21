import React from 'react';
import { connect } from 'react-redux';

import { Summary as FilterSummary } from '../filter/summary';
// import ProgressBar from '../progress-bar';
import CircularProgress from '../components/CircularProgress.react';

import ErrorSummary from './ErrorSummary.react';

import * as uploads from './selectors';

const Summary = React.createClass({

  componentDidUpdate() {
    const { summary } = this.props;
    document.title = [
      'WGSA',
      '|',
      summary.total ? `(${summary.completed}/${summary.total})` : '',
      'Genomes',
    ].join(' ');
  },

  render() {
    const { summary } = this.props;
    if (summary.total) {
      return (
        <FilterSummary className="wgsa-upload-summary">
          <div style={{ margin: 16 }}>
            <CircularProgress radius="40" strokeWidth="8" percentage={(summary.completed / summary.total) * 100} />
          </div>
          {/* <ProgressBar
            className="wgsa-filter-summary__count"
            progress={(summary.completed / summary.total) * 100}
            label={`${summary.completed}/${summary.total}`}
          /> */}
        </FilterSummary>
      );
    }

    if (this.props.totalErroredUploads > 0) {
      return <ErrorSummary />;
    }

    return <FilterSummary />;
  },

});

function mapStateToProps(state) {
  return {
    isUploading: uploads.isUploading(state),
    totalErroredUploads: uploads.getTotalErrors(state),
    summary: uploads.getSummary(state),
  };
}

export default connect(mapStateToProps)(Summary);
