import React from 'react';
import { NavLink } from 'react-router-dom';

import { Summary } from '../filter/summary';

import { formatDateTime } from '~/utils/Date';

const UploadSummary = ({ uploadedAt }) => (
  <Summary className="wgsa-upload-summary">
    {uploadedAt ? (
      <React.Fragment>
        <a className="mdl-button" onClick={() => window.history.back()}>
          <i className="material-icons">arrow_back</i> Go back
        </a>
        <p style={{ marginLeft: 'auto', fontWeight: '500' }}>
          {formatDateTime(uploadedAt)}
        </p>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <NavLink
          activeClassName="mdl-button--primary"
          className="mdl-button"
          exact
          to="/upload"
        >
          New Upload
        </NavLink>
        <NavLink
          activeClassName="mdl-button--primary"
          className="mdl-button"
          exact
          to="/upload/previous"
        >
          Previous Uploads
        </NavLink>
      </React.Fragment>
    )}
  </Summary>
);

export default UploadSummary;
