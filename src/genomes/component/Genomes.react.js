import React from 'react';
import { connect } from 'react-redux';

import FileDragAndDrop from '../../drag-and-drop';
import ProgressBar from '../../progress-bar';
import Overlay from '../../overlay';

import Filter from '../filter';
import Summary from '../summary';
import SelectionDrawer from '../selection';
import Instructions from '../uploads/Instructions.react';

import { getGridItems } from '../selectors';
import { getPrefilter } from '../filter/selectors';
import { getTotal } from '../summary/selectors';
import { getStatus } from '../selectors';

import { statuses } from '../constants';

const Component = React.createClass({

  propTypes: {
    hasGenomes: React.PropTypes.bool,
    uploads: React.PropTypes.object,
    toggleAside: React.PropTypes.func.isRequired,
    addFiles: React.PropTypes.func.isRequired,
    isUploading: React.PropTypes.bool,
    waiting: React.PropTypes.bool,
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
    const { prefilter, isUploading, fetch } = this.props;
    if (prefilter === 'upload') {
      if (previous.isUploading && !isUploading) {
        fetch();
      }
    }
  },

  componentWillUnmount() {
    this.props.toggleAside(false);
  },

  upload(newFiles) {
    this.props.addFiles(newFiles);
    this.context.router.push('/genomes/upload');
  },

  renderEmptyMessage() {
    const { total, prefilter } = this.props;

    if (total === 0) {
      switch (prefilter) {
        case 'upload':
          return (
            <Instructions />
          );
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
      <FileDragAndDrop onFiles={this.upload}>
        { this.props.waiting && <ProgressBar indeterminate /> }
        <div className="wgsa-hipster-style wgsa-filterable-view">
          <Summary />
          {this.renderContent()}
        </div>
        <Filter />
        <SelectionDrawer />
        <Overlay visible={this.props.status === statuses.LOADING}>
          <p className="wgsa-big-message">
            Loading... ⌛
          </p>
        </Overlay>
      </FileDragAndDrop>
    );
  },

});

function mapStateToProps(state) {
  return {
    items: getGridItems(state),
    prefilter: getPrefilter(state),
    total: getTotal(state),
    status: getStatus(state),
  };
}

export default connect(mapStateToProps)(Component);
