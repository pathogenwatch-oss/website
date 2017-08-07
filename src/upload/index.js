import './styles.css';

import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Progress from './progress';
import Instructions from './instructions';
import Previous from './previous';

import { isUploading, getUploadedAt } from './progress/selectors';

const path = '/upload';

function mapStateToProps(state) {
  return {
    uploading: isUploading(state),
    uploadedAt: getUploadedAt(state),
  };
}

const Router = connect(mapStateToProps)(
  ({ uploading, uploadedAt, match }) => {
    if (match.isExact && uploading) {
      return <Redirect to={`${path}/${uploadedAt}`} />;
    }

    return (
      <Switch>
        <Route path={`${path}/previous`} component={Previous} />
        <Route path={`${path}/:uploadedAt`} component={Progress} />
        <Route component={Instructions} />
      </Switch>
    );
  }
);

export reducer from './reducer';
export default <Route path={path} component={Router} />;
