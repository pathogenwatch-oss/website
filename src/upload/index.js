import './styles.css';

import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AuthRoute from '../sign-in/AuthRoute.react';
import Progress from './progress';
import Instructions from './instructions';
import Previous from './previous';

import { isUploading, getUploadedAt } from './progress/selectors';
import { useAuthToken } from '../auth/hooks';

const path = '/upload';

function mapStateToProps(state) {
  return {
    uploading: isUploading(state),
    uploadedAt: getUploadedAt(state),
  };
}

const Router = connect(mapStateToProps)(({ uploading, uploadedAt, match }) => {
  useAuthToken();

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
});

export default (
  <AuthRoute
    authMessage="Please sign in to upload genomes."
    path={path}
    component={Router}
  />
);
