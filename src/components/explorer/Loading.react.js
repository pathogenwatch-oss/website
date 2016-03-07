import '../../css/loading.css';
import '../../css/progress-bar.css';

import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Spinner from '^/components/Spinner.react';

import { updateHeader } from '^/actions/header';

import { statuses } from '^/constants/collection';

import { UPLOAD_FAILED } from '^/stores/FileUploadingStore';

import Species from '^/species';
import { CGPS } from '^/defaults';

const backgroundStyle = {
  background: CGPS.COLOURS.GREY_LIGHT,
};

const Background = connect()(React.createClass({

  componentWillMount() {
    this.props.dispatch(updateHeader({
      speciesName: Species.formattedName,
      classNames: 'mdl-layout__header--primary mdl-shadow--3dp',
      content: null,
    }));
  },

  componentDidMount() {
    componentHandler.upgradeDom();
  },

  render() {
    return (
      <div style={backgroundStyle} className="wgsa-loading-container mdl-grid">
        <div className="mdl-cell mdl-cell--10-col">
          <img src="/assets/img/WGSA.FINAL.svg" className="wgsa-loading-logo"/>
          { this.props.children }
        </div>
      </div>
    );
  },

}));

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

const fatalTasks = new Set([ 'UPLOAD', 'CORE' ]);

function getFailedAssemblies(errors) {
  return errors.reduce((memo, { taskType, assemblyName }) => {
    if (fatalTasks.has(taskType)) {
      memo.push(assemblyName);
    }
    return memo;
  }, []);
}

function getStatusMessage(status, errors) {
  if (status === statuses.NOT_FOUND) {
    return [
      <h1>We're sorry, this collection is currently unavailable</h1>,
      <p className="mdl-typography--title">It may be available again later.</p>,
    ];
  }
  if (status === statuses.FATAL) {
    const failedAssemblies = getFailedAssemblies(errors);
    return [
      <h1>We're sorry, your collection could not be processed</h1>,
      <p className="mdl-typography--title">The following assemblies were rejected:</p>,
      <ul className="wgsa-failed-assemblies">{failedAssemblies.map(assemblyName => <li key={assemblyName}>{assemblyName}</li>)}</ul>,
      <p className="mdl-typography--title">Please ensure that assemblies are the correct species and meet our quality criteria.</p>,
      <Link to={`/${Species.nickname}/upload`} className="mdl-button mdl-button--raised">Try Again</Link>,
    ];
  }
  if (status === UPLOAD_FAILED || status === statuses.ABORTED) {
    return [
      <h1>We're sorry, your upload was interrupted</h1>,
      <p className="mdl-typography--title">
        Please upload your files again.
      </p>,
      <Link to={`/${species.nickname}/upload`} className="mdl-button mdl-button--raised">Go Back</Link>,
    ];
  }
}

export const LoadError = React.createClass({

  componentWillMount() {
    document.title = 'WGSA | Error';
  },

  render() {
    const { status, errors } = this.props;
    return (
      <Background>
        { getStatusMessage(status, errors) }
        <p>Please contact <a href="mailto:cgps@sanger.ac.uk">cgps@sanger.ac.uk</a> if problems persist.</p>
      </Background>
    );
  },

});
