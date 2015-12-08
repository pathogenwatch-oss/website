import React from 'react';

import Spinner from '^/components/Spinner.react';

import DEFAULT from '^/defaults';

const errorStyle = {
  color: DEFAULT.DANGER_COLOUR,
};

export default ({ loading, hasLink, error }) => (
  <div className="wgsa-download-icon" >
    { loading ?
      <Spinner />
      :
      <span className="mdl-button mdl-button--icon">
        <i className="wgsa-button-icon material-icons" style={error ? errorStyle : null}>
          { !hasLink || error ? 'insert_drive_file' : 'file_download' }
        </i>
      </span>
    }
  </div>
);
