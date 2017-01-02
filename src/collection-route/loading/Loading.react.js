import './styles.css';

import React from 'react';
import { Link } from 'react-router/es';
import { connect } from 'react-redux';

import Spinner from '../../components/Spinner.react';

import { statuses } from '../constants';

import Species from '../../species';
import { CGPS } from '../../app/constants';

const backgroundStyle = {
  background: CGPS.COLOURS.GREY_LIGHT,
};

const Background = connect()(React.createClass({

  componentDidMount() {
    componentHandler.upgradeDom();
  },

  render() {
    return (
      <div style={backgroundStyle} className="wgsa-loading-container">
        <div className="wgsa-loading-content">
          <img src="/assets/img/WGSA.FINAL.svg" className="wgsa-loading-logo" />
          { this.props.children }
        </div>
      </div>
    );
  },

}));

export const LoadSpinner = React.createClass({

  displayName: 'LoadSpinner',

  componentWillMount() {
    document.title = 'WGSA | Loading...';
  },

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

function getStatusMessage(status, { collectionSize, errors = [] }) {
  if (status === statuses.NOT_FOUND) {
    return [
      <h1>We're sorry, this collection cannot be displayed</h1>,
      <p className="mdl-typography--title">Please ensure that the URL is correct, and if so, please try again later.</p>,
    ];
  }
  if (status === statuses.FATAL) {
    const failedAssemblies = getFailedAssemblies(errors);
    const totalFail = collectionSize === failedAssemblies.length;
    return [
      <h1>We're sorry, your collection could not be processed</h1>,
      totalFail ?
        <p className="mdl-typography--title">All {collectionSize} assemblies were rejected.</p> :
        <p className="mdl-typography--title">{failedAssemblies.length} of {collectionSize} assemblies were rejected:</p>,
      !totalFail ? <ul className="wgsa-failed-assemblies">{failedAssemblies.map(assemblyName => <li key={assemblyName}>{assemblyName}</li>)}</ul> : null,
      <p className="mdl-typography--title">Please ensure assemblies are the correct species, as we were unable to process them as {Species.current.formattedShortName}.</p>,
      <Link to={`/${Species.nickname}/upload`} className="mdl-button mdl-button--raised">Try Again</Link>,
    ];
  }
  if (status === statuses.ABORTED) {
    return [
      <h1>We're sorry, your upload was interrupted</h1>,
      <p className="mdl-typography--title">
        Please upload your files again.
      </p>,
      <Link to={`/${Species.nickname}/upload`} className="mdl-button mdl-button--raised">Go Back</Link>,
    ];
  }
}

export const LoadError = React.createClass({

  componentWillMount() {
    document.title = 'WGSA | Error';
  },

  render() {
    const { status, progress } = this.props;
    return (
      <Background>
        { getStatusMessage(status, progress) }
        <p>Please contact <a href="mailto:cgps@sanger.ac.uk">cgps@sanger.ac.uk</a> if problems persist.</p>
      </Background>
    );
  },

});
