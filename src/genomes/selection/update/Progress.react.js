import React from 'react';
import PropTypes from 'prop-types';

import Fade from '../../../components/fade';
import CircularProgress from '../../../components/CircularProgress.react';

export default React.createClass({
  displayName: 'Progress',

  propTypes: {
    error: PropTypes.shape({
      row: PropTypes.number,
      message: PropTypes.string,
    }),
    reset: PropTypes.func,
    progress: PropTypes.number,
    rows: PropTypes.number,
  },

  render() {
    if (this.props.error) {
      const { row, message } = this.props.error;
      return (
        <div className="pw-update-metadata-progress">
          <p>
            <strong>We're sorry! There was a problem with row {row}:</strong>
          </p>
          <p>{message}</p>
          <button
            className="mdl-button mdl-button--raised mdl-button--colored"
            onClick={this.props.reset}
          >
            Try Again
          </button>
        </div>
      );
    }

    const { progress } = this.props;
    return (
      <div className="pw-update-metadata-progress">
        <CircularProgress
          percentage={progress}
          radius="48"
          strokeWidth="12"
          decimalPlaces={0}
        />
        <Fade out={false}>
          {progress === 100 ? (
            <p key="complete" className=" pw-update-metadata-success">
              <i className="material-icons">check_circle</i>
              {this.props.rows} genome{this.props.rows === 1 ? ' ' : 's '}
              updated successfully
            </p>
          ) : (
            <p className="wgsa-blink">Uploading...</p>
          )}
        </Fade>
      </div>
    );
  },
});
