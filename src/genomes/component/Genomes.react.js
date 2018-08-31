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
        <div className="pw-filter-view-message">
          <p>No matches, please refine your search.</p>
          <button
            className="mdl-button mdl-button--raised mdl-button--colored"
            onClick={this.props.clearFilter}
          >
            Clear Filters
          </button>
        </div>
      );
    }

    if (total === 0) {
      switch (prefilter) {
        case 'bin':
          return (
            <p className="pw-filter-view-message">
              Nothing in the bin 👍
            </p>
          );
        case 'user':
          return (
            <div className="pw-filter-view-message">
              <p>You haven't uploaded any genomes.</p>
              <p><Link to="/upload" className="mdl-button mdl-button--raised mdl-button--colored">Upload now</Link></p>
            </div>
          );
        default:
          return (
            <p className="pw-filter-view-message">
              Nothing to see here.
            </p>
          );
      }
    }

    return null;
  },

  renderContent() {
    const { items, total, status } = this.props;

    if (status === statuses.ERROR) {
      return (
        <p className="pw-filter-view-message">
          Something went wrong. 😞
        </p>
      );
    }

    // Initial load
    if (total === 0 && status === statuses.LOADING) {
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
          <p className="pw-filter-view-loading">
            Loading... ⏳
          </p>
        </Overlay>
      </div>
    );
  },

});
