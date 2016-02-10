import '../../css/loading.css';
import '../../css/progress-bar.css';

import React from 'react';
import { Link } from 'react-router';

import Spinner from '^/components/Spinner.react';

import { statuses } from '^/constants/collection';
import species from '^/species';
import { CGPS } from '^/defaults';

const backgroundStyle = {
  background: CGPS.COLOURS.GREY_LIGHT,
};

const Background = ({ children }) => (
  <main style={backgroundStyle} className="wgsa-loading-container mdl-grid">
    <div className="mdl-cell mdl-cell--10-col">
      <img src="/assets/img/WGSA.FINAL.svg" className="wgsa-loading-logo"/>
      { children }
    </div>
  </main>
);

export const LoadSpinner = React.createClass({

  displayName: 'LoadSpinner',

  render() {
    return (
      <Background>
        <Spinner />
        <h1>Loading collection...</h1>
      </Background>
    );
  },

});

function getFailedAssemblies(errors) {
  return errors.reduce((memo, { taskType, assemblyName }) => {
    if (taskType === 'UPLOAD') {
      memo.push(assemblyName);
    }
    return memo;
  }, []);
}

function getStatusMessage(status, errors) {
  if (status === statuses.NOT_FOUND) {
    return [
      <h1>We're sorry, your collection is currently unavailable</h1>,
      <p className="mdl-typography--title">You may be able to try again later.</p>,
    ];
  }
  if (status === statuses.FATAL) {
    const failedAssemblies = getFailedAssemblies(errors);
    return [
      <h1>We're sorry, your collection could not be processed</h1>,
      <p className="mdl-typography--title">The following assemblies were rejected:</p>,
      <ul>{failedAssemblies.map(assemblyName => <li key={assemblyName}>{assemblyName}</li>)}</ul>,
      <p className="mdl-typography--title">Please ensure that assemblies are the correct species and meet our quality criteria.</p>,
      <Link to={`/${species.nickname}/upload`} className="mdl-button mdl-button--raised">Try Again</Link>,
    ];
  }
}

export const LoadError = ({ status, errors }) => (
  <Background>
    { getStatusMessage(status, errors) }
    <p>Please contact <a href="mailto:cgps@sanger.ac.uk">cgps@sanger.ac.uk</a> if problems persist.</p>
  </Background>
);
