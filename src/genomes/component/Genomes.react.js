import React from 'react';
import { connect } from 'react-redux';

import FileDragAndDrop from '../../drag-and-drop';
import ProgressBar from '../../progress-bar';

import Filter from '../filter';
import Summary from '../summary';
import SelectionDrawer from '../selection';

import { getGridItems } from '../selectors';
import { getPrefilter } from '../filter/selectors';
import { getTotal } from '../summary/selectors';
import { getStatus } from '../selectors';

import { statuses } from '../constants';

const Compnent = React.createClass({

  propTypes: {
    hasGenomes: React.PropTypes.bool,
    uploads: React.PropTypes.object,
    toggleAside: React.PropTypes.func.isRequired,
    addFiles: React.PropTypes.func.isRequired,
    isUploading: React.PropTypes.bool,
    waiting: React.PropTypes.bool,
    prefilter: React.PropTypes.string,
    filter: React.PropTypes.func,
  },

  contextTypes: {
    router: React.PropTypes.object,
  },

  componentWillMount() {
    this.props.filter();
  },

  componentDidUpdate(previous) {
    const { prefilter, isUploading, filter } = this.props;
    if (prefilter === 'upload') {
      if (previous.isUploading && !isUploading) {
        filter();
      }
    }
  },

  componentWillUnmount() {
    this.props.toggleAside(false);
  },

  upload(newFiles) {
    const { addFiles } = this.props;
    addFiles(newFiles);
    const { router } = this.context;
    router.push('/genomes/upload');
  },

  renderEmptyMessage() {
    const { total, prefilter } = this.props;

    if (total === 0) {
      switch (prefilter) {
        case 'upload':
          return (
            <p className="wgsa-hub-big-message">
              Drag and drop files to begin.
            </p>
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

  render() {
    const { items, status, waiting } = this.props;

    if (status === statuses.LOADING) {
      return (
        <p className="wgsa-hub-big-message">
          Loading... ⌛
        </p>
      );
    }

    if (status === statuses.ERROR) {
      return (
        <p className="wgsa-hub-big-message">
          Something went wrong. 😞
        </p>
      );
    }

    if (items.length === 0) {
      return this.renderEmptyMessage();
    }

    return (
      <FileDragAndDrop onFiles={this.upload}>
        { waiting && <ProgressBar indeterminate /> }
        <div className="wgsa-hipster-style wgsa-filterable-view">
          <Summary />
          {this.props.children}
        </div>
        <Filter />
        <SelectionDrawer />
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

export default connect(mapStateToProps)(Compnent);
