import React from 'react';

import FileDragAndDrop from '../../drag-and-drop';
import ProgressBar from '../../progress-bar';

import Filter from '../filter';
import Summary from '../summary';
import CreateCollectionDrawer from '../create-collection-drawer';

export default React.createClass({

  propTypes: {
    hasGenomes: React.PropTypes.bool,
    uploads: React.PropTypes.object,
    filterActive: React.PropTypes.bool,
    toggleAside: React.PropTypes.func.isRequired,
    addFiles: React.PropTypes.func.isRequired,
  },

  contextTypes: {
    router: React.PropTypes.object,
  },

  componentWillMount() {
    this.props.prefilter();
  },

  componentDidUpdate() {
    const { collection } = this.props;

    if (collection.slug) {
      const { router } = this.context;
      router.push(`/collection/${collection.slug}`);
    }
  },

  componentWillUnmount() {
    this.props.toggleAside(false);
  },

  upload(newFiles) {
    const { addFiles, toggleAside } = this.props;
    addFiles(newFiles);
    toggleAside(true);
  },

  render() {
    const { loading } = this.props;
    return (
      <FileDragAndDrop onFiles={this.upload}>
        { loading && <ProgressBar indeterminate /> }
        <div className="wgsa-hipster-style wgsa-filterable-view">
          <Summary />
          {this.props.children}
        </div>
        <Filter />
        <CreateCollectionDrawer />
      </FileDragAndDrop>
    );
  },

});
