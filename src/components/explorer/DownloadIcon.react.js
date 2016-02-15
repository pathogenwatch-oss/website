import React from 'react';

import Spinner from '^/components/Spinner.react';

import DEFAULT from '^/defaults';

const errorStyle = {
  color: DEFAULT.DANGER_COLOUR,
};

export default ({ loading, hasLink, error, color, label }) => (
  <div className="wgsa-download-icon" >
    { loading ?
      <Spinner />
      :
      <span className="mdl-button mdl-button--icon">
        <i className="wgsa-button-icon material-icons" style={error ? errorStyle : { color }}>
          { !hasLink || error ? 'insert_drive_file' : 'file_download' }
        </i>
        {label ? <span className="wgsa-download-label">{label}</span> : null }
      </span>
    }
  </div>
);
