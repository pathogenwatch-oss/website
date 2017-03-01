import React from 'react';

import FileDragAndDrop from '../../drag-and-drop';
import ProgressBar from '../../progress-bar';

import Filter from '../filter';
import Summary from '../summary';
import SelectionDrawer from '../selection';

export default React.createClass({

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

  render() {
    const { waiting } = this.props;
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
