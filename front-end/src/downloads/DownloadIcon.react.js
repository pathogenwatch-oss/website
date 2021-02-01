import React from 'react';

import Spinner from '../components/Spinner.react';

import { DEFAULT } from '../app/constants';
import { statuses } from './constants';

const errorStyle = {
  color: DEFAULT.DANGER_COLOUR,
};

export default ({ status, color, label, isArchive }) => (
  <div className="wgsa-download-icon" >
    { status === statuses.LOADING ?
      <Spinner /> :
      <div>
        <i
          className="wgsa-button-icon material-icons"
          style={status === statuses.ERROR ? errorStyle : { color }}
        >
          { isArchive ? 'archive' : 'insert_drive_file' }
        </i>
        { label ? <span className="wgsa-download-label">{label}</span> : null }
      </div>
    }
  </div>
);
