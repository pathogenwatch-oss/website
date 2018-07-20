import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import Overlay from '../../overlay';

import Filter from '../filter';
import Header from '../header';

import { statuses } from '../constants';
import DocumentTitle from '../../branding/DocumentTitle.react';

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
    const { total, prefilter, filterActive } = this.props;
    if (filterActive) {
      return (
        <p className="wgsa-hub-big-message">
          No matches, please refine your search.
        </p>
      );
    }

    if (total === 0) {
      switch (prefilter) {
        case 'bin':
          return (
            <p className="wgsa-hub-big-message">
              Nothing in the bin 👍
            </p>
          );
        case 'user':
          return (
            <div className="pw-flex-center pw-expand pw-onboarding-message">
              <p>You haven't uploaded any genomes yet 😮</p>
              <p><Link to="/upload" className="mdl-button mdl-button--raised mdl-button--colored">Upload now</Link></p>
            </div>
          );
        default:
          return (
            <p className="wgsa-hub-big-message">
              Nothing to show  ¯\_(ツ)_/¯
            </p>
          );
      }
    }

    return (
      <p className="wgsa-hub-big-message">
        Nothing to show  ¯\_(ツ)_/¯
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
      <div
        className={classnames(
          'wgsa-genomes wgsa-filter-container',
          { 'has-filter': this.props.isFilterOpen }
        )}
      >
        <DocumentTitle title="Genomes" />
        <Filter />
        <div className="wgsa-filter-content">
          <Header prefilter={this.props.prefilter} />
          {this.renderContent()}
        </div>
        <Overlay visible={this.props.status === statuses.LOADING}>
          <p className="wgsa-big-message">
            Loading... ⏳
          </p>
        </Overlay>
      </div>
    );
  },

});
