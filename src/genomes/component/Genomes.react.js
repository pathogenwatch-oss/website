import React from 'react';

import FileDragAndDrop from '../../components/DragAndDrop.react';

import Filter from '../filter';
import Summary from '../summary';
import HubDrawer from '../create-collection-drawer';

import { taxIdMap } from '../../species';

export default React.createClass({

  propTypes: {
    hasGenomes: React.PropTypes.bool,
    uploads: React.PropTypes.object,
    filterActive: React.PropTypes.bool,
    toggleAside: React.PropTypes.func.isRequired,
    fetchGenomes: React.PropTypes.func.isRequired,
    addFiles: React.PropTypes.func.isRequired,
  },

  contextTypes: {
    router: React.PropTypes.object,
  },

  componentWillMount() {
    this.props.fetchGenomes().
      then(() => this.props.toggleAside(true));
  },

  componentDidUpdate() {
    const { loading, collection } = this.props;

    if (loading) {
      componentHandler.upgradeElement(this.refs.loadingBar);
    }

    if (collection.id) {
      const { speciesId, id } = collection;
      const species = taxIdMap.get(speciesId);
      const path = `/${species.nickname}/collection/${id}`;
      const { router } = this.context;
      router.push(path);
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
        { loading && <div ref="loadingBar" className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>}
        <div className="wgsa-hipster-style wgsa-filterable-view">
          <Summary />
          {this.props.children}
        </div>
        <Filter />
        <HubDrawer />
      </FileDragAndDrop>
    );
  },

});
