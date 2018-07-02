import React from 'react';

import Fade from '../../components/fade';

import * as api from './api';

const statuses = {
  LOADING: 'LOADING',
  NOT_READY: 'NOT_READY',
  VERIFIED: 'VERIFIED',
  ERROR: 'ERROR',
  FAILED_TO_VERIFY: 'FAILED_TO_VERIFY',
};

const motivationals = [
  'Hang on in there',
  'Stay strong',
  'You can do this',
];

function getMotivational() {
  return motivationals[Math.floor(Math.random() * motivationals.length)];
}

const Verifier = React.createClass({

  getInitialState() {
    return {
      status: statuses.LOADING,
      failed: false,
    };
  },

  componentDidMount() {
    this.verify(1000);
    this.interval = setInterval(() => this.verify(2000), 10000);
  },

  componentDidUpdate(_, previous) {
    const { VERIFIED, ERROR } = statuses;
    const { status } = this.state;

    if (previous.status !== VERIFIED && status === VERIFIED) {
      clearInterval(this.interval);
    }

    if (status === ERROR) {
      clearInterval(this.interval);
    }
  },

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },

  verify(wait = 2000) {
    this.setState({ status: statuses.LOADING });
    Promise.all([
      api.verify(this.props.genomes, this.props.organismId)
        .then(() => ({ status: statuses.VERIFIED }))
        .catch(error => {
          if (error.status === 400) {
            return error.responseJSON || {};
          }
          return { status: statuses.FAILED_TO_VERIFY };
        }),
      new Promise(resolve => setTimeout(resolve, wait)),
    ])
    .then(([ nextState ]) => this.setState(nextState));
  },

  renderStatus() {
    if (this.state.status === statuses.NOT_READY) {
      return (
        <div>
          <p>Core analysis incomplete, {this.state.pending} result{this.state.pending === 1 ? '' : 's'} to go.</p>
          <p>{getMotivational()}. 😓</p>
        </div>
      );
    }

    if (this.state.status === statuses.ERROR) {
      return (
        <div>
          <p>Core analysis could not be completed for this selection.</p>
          <p>Please resubmit your genomes and try again.</p>
        </div>
      );
    }

    if (this.state.status === statuses.FAILED_TO_VERIFY) {
      return (
        <p>Something went wrong 😞</p>
      );
    }

    return (
      <p className="wgsa-blink">Verifying core analysis...</p>
    );
  },

  render() {
    const { status } = this.state;
    if (status === statuses.VERIFIED) {
      return this.props.children;
    }

    return (
      <Fade className="wgsa-collection-verify" out={false}>
        { React.cloneElement(this.renderStatus(), { key: this.state.status }) }
      </Fade>
    );
  },

});

export default Verifier;
