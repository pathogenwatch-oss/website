import React from 'react';
import { NavLink } from 'react-router-dom';

import { Summary } from '../filter/summary';

const UploadSummary = ({ children }) => (
  <Summary className="wgsa-upload-summary pw-upload-page">
    {children || (
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
