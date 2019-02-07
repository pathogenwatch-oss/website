import React from 'react';
import PropTypes from 'prop-types';

import Fade from '../../../components/fade';

export default React.createClass({
  displayName: 'Progress',

  propTypes: {
    error: PropTypes.shape({
      row: PropTypes.number,
      message: PropTypes.string,
    }),
    progress: PropTypes.number,
    rows: PropTypes.number,
  },

  render() {
    if (this.props.error) {
      const { row = null, message } = this.props.error;
      return (
        <div className="pw-update-metadata-progress error">
          <p>
            Sorry! There was a problem
            {row !== null ? ` with row ${row}` : ''}:
          </p>
          <p>{message}</p>
        </div>
      );
    }

    const { result } = this.props;
    return (
      <div className="pw-update-metadata-progress success">
        <Fade>
          {result ? (
            <p key="complete">
              <i className="material-icons">check_circle</i>
              {result.matched} genome{result.matched === 1 ? ' ' : 's '}
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
