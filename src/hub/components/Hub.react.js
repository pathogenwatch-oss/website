import React from 'react';

import FileDragAndDrop from '../../components/DragAndDrop.react';

import Filter from './Filter.react';
import Summary from './Summary.react';
import CreateCollectionTray from './CreateCollectionTray.react.js';

import { addFiles } from '../thunks';
import { toggleAside } from '../../header';

import { taxIdMap } from '^/species';

export default React.createClass({

  propTypes: {
    hasFastas: React.PropTypes.bool,
    uploads: React.PropTypes.object,
    filterActive: React.PropTypes.bool,
    dispatch: React.PropTypes.func.isRequired,
  },

  contextTypes: {
    router: React.PropTypes.object,
  },

  componentWillMount() {
    this.toggleAside(this.props.hasFastas);
    document.title = 'WGSA | Upload';
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

  toggleAside(isOpen) {
    this.props.dispatch(toggleAside(isOpen));
  },

  upload(newFiles) {
    const { dispatch } = this.props;
    dispatch(addFiles(newFiles));
    this.toggleAside(true);
  },

  render() {
    const { hasFastas, filterActive, loading, location } = this.props;
    return (
      <FileDragAndDrop onFiles={this.upload}>
        { loading && <div ref="loadingBar" className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>}
        <div className="wgsa-hub">
          <Summary pathname={location && location.pathname} />
          { hasFastas ?
            this.props.children :
            <p className="wgsa-hub__view wgsa-hub-big-message">
              { filterActive ?
                  'No matches.' :
                  'Drag and drop files to begin.'
              }
            </p>
          }
        </div>
        <Filter filterActive={filterActive} />
        <CreateCollectionTray />
      </FileDragAndDrop>
    );
  },

});
