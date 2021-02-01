import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { Summary } from '../filter/summary';

import { hasIncompleteUploads } from './selectors';

const UploadSummary = ({ children, hasIncomplete }) => (
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
          { hasIncomplete && <span title="You have incomplete uploads." className="pw-blipper wgsa-blink" /> }
        </NavLink>
      </React.Fragment>
    )}
  </Summary>
);

function mapStateToProps(state) {
  return {
    hasIncomplete: hasIncompleteUploads(state),
  };
}

export default connect(mapStateToProps)(UploadSummary);
