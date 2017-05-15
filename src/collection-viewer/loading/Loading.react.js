import './styles.css';

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Spinner from '../../components/Spinner.react';

import { statuses } from '../constants';

import Organisms from '../../organisms';
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
          <img src="/images/WGSA.FINAL.svg" className="wgsa-loading-logo" />
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

const fatalTasks = new Set([ 'CORE', 'FP' ]);

function getFailedGenomes(errors) {
  return errors.reduce((memo, { taskType, name }) => {
    if (fatalTasks.has(taskType)) {
      memo.push(name);
    }
    return memo;
  }, []);
}

function getStatusMessage({ collection }) {
  if (!collection.slug) {
    return [
      <h1>We're sorry, something went wrong.</h1>,
      <p className="mdl-typography--title">Please try again later.</p>,
    ];
  }

  const { status, size, progress: { errors } } = collection;
  if (status === statuses.NOT_FOUND) {
    return [
      <h1>We're sorry, this collection cannot be found.</h1>,
      <p className="mdl-typography--title">Please ensure that the address is correct, and if so, please try again later.</p>,
    ];
  }
  if (status === statuses.ABORTED) {
    return [
      <h1>We're sorry, your upload was interrupted</h1>,
      <p className="mdl-typography--title">
        Please upload your files again.
      </p>,
      <Link to={`/${Organisms.nickname}/upload`} className="mdl-button mdl-button--raised">Go Back</Link>,
    ];
  }
  if (status === statuses.FAILED) {
    const failedGenomes = getFailedGenomes(errors);
    const totalFail = size === failedGenomes.length;
    return [
      <h1>We're sorry, something went wrong.</h1>,
      totalFail ? <p className="mdl-typography--title">All {size} genomes were rejected.</p> : null,
      !totalFail && failedGenomes.length ? <p className="mdl-typography--title">{failedGenomes.length} {failedGenomes.length === 1 ? 'genome was' : 'genomes were'} rejected:</p> : null,
      !totalFail && failedGenomes.length ? <ul className="wgsa-failed-genomes">{failedGenomes.map(genomeName => <li key={genomeName}>{genomeName}</li>)}</ul> : null,
      <Link to={`/${Organisms.nickname}/upload`} className="mdl-button mdl-button--raised">Try Again</Link>,
    ];
  }
}

export const LoadError = React.createClass({

  componentWillMount() {
    document.title = 'WGSA | Error';
  },

  render() {
    return (
      <Background>
        { getStatusMessage(this.props) }
        <p>Please contact <a href="mailto:cgps@sanger.ac.uk">cgps@sanger.ac.uk</a> if problems persist.</p>
      </Background>
    );
  },

});
