import React from 'react';

import Overlay from '../../overlay';

import Filter from '../filter';
import Header from '../header';
import Selection from '../selection';

import { statuses } from '../constants';

export default React.createClass({

  propTypes: {
    hasGenomes: React.PropTypes.bool,
    uploads: React.PropTypes.object,
    isUploading: React.PropTypes.bool,
    prefilter: React.PropTypes.string,
    fetch: React.PropTypes.func,
  },

  contextTypes: {
    router: React.PropTypes.object,
  },

  componentWillMount() {
    this.props.fetch();
  },

  componentDidUpdate(previous) {
    const { prefilter, fetch } = this.props;

    if (previous.prefilter !== prefilter) {
      fetch();
      return;
    }
  },

  renderEmptyMessage() {
    const { total, prefilter } = this.props;

    if (total === 0) {
      switch (prefilter) {
        case 'bin':
          return (
            <p className="wgsa-hub-big-message">
              Nothing in the bin 👍
            </p>
          );
        default:
          return (
            <p className="wgsa-hub-big-message">
              Something went wrong. 😞
            </p>
          );
      }
    }

    return (
      <p className="wgsa-hub-big-message">
        No matches.
      </p>
    );
  },

  renderContent() {
    const { items, status } = this.props;

    if (status === statuses.ERROR) {
      return (
        <p className="wgsa-hub-big-message">
          Something went wrong. 😞
        </p>
      );
    }

    if (items.length === 0 && status === statuses.LOADING) {
      return null;
    }

    if (items.length === 0) {
      return this.renderEmptyMessage();
    }

    return this.props.children;
  },

  render() {
    return (
      <div className="wgsa-genomes">
        <Header />
        <div className="wgsa-filterable-view">
          <Filter />
          <div className="wgsa-genomes-content">
            {this.renderContent()}
          </div>
          <Selection />
        </div>
        <Overlay visible={this.props.status === statuses.LOADING}>
          <p className="wgsa-big-message">
            Loading... ⌛
          </p>
        </Overlay>
      </div>
    );
  },

});
