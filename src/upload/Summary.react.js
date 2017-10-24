import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Summary } from '../filter/summary';

import { isUploading } from './progress/selectors';

function mapStateToProps(state) {
  return {
    uploading: isUploading(state),
  };
}

export default connect(mapStateToProps)(
  ({ uploading, previous, children }) => (
    <Summary className="wgsa-upload-summary">
      {!uploading &&
        <Link
          className={classnames('mdl-button', { 'mdl-button--primary': !previous })}
          to="/upload"
        >
          New Upload
        </Link> }
      {!uploading &&
        <Link
          className={classnames('mdl-button', { 'mdl-button--primary': previous })}
          to="/upload/previous"
        >
          Previous Uploads
        </Link> }
      {children}
    </Summary>
  )
);
