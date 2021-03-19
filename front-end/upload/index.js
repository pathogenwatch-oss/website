import './styles.css';

import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AuthRoute from '../sign-in/AuthRoute.react';
import ErrorOverlay from './ErrorOverlay.react';
import Instructions from './instructions';
import UploadType from './instructions/upload-type';
import Previous from './previous';
import Progress from './progress';

import { getUploadedAt } from './progress/selectors';
import { isUploading } from './progress/files/selectors';

function mapStateToProps(state) {
  return {
    uploading: isUploading(state),
    uploadedAt: getUploadedAt(state),
  };
}

const Router = connect(mapStateToProps)(
  ({ uploading, uploadedAt, match }) => {
    if (match.isExact && uploading) {
      return <Redirect to={`/upload/${uploadedAt}`} />;
    }

    return (
      <div className="wgsa-hipster-style">
        <Switch>
          <Route path="/upload/previous" component={Previous} />
          <Route path="/upload/fasta" component={Instructions} />
          <Route path="/upload/multi-fasta" component={Instructions} />
          <Route path="/upload/reads" component={Instructions} />
          <Route path="/upload/:uploadedAt" component={Progress} />
          <Route component={UploadType} />
        </Switch>
        <ErrorOverlay />
      </div>
    );
  }
);

export default (
  <Route
    path="/upload"
    component={Router}
  />
);

// export default (
//   <AuthRoute
//     authMessage="Please sign in to upload genomes."
//     path="/upload"
//     component={Router}
//   />
// );
