import React from 'react';

import FileDragAndDrop from '../../components/upload/DragAndDrop.react';

import Header from './Header.react';
import Filter from './Filter.react';
import Summary from './Summary.react';

import { updateHeader } from '^/actions/header';
import { addFiles } from '../thunks';

import { taxIdMap } from '^/species';

export default React.createClass({

  propTypes: {
    fastas: React.PropTypes.array.isRequired,
    uploads: React.PropTypes.object,
    filterActive: React.PropTypes.bool,
    dispatch: React.PropTypes.func.isRequired,
  },

  contextTypes: {
    router: React.PropTypes.object,
  },

  componentWillMount() {
    this.toggleAside();
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

    this.toggleAside();
  },

  toggleAside() {
    const { fastas, dispatch } = this.props;
    const isOpen = fastas && fastas.length > 0;

    dispatch(
      updateHeader({
        hasAside: isOpen,
        classNames: 'wgsa-hub-header',
        content: <Header />,
      })
    );
  },

  upload(newFiles) {
    const { dispatch } = this.props;
    dispatch(addFiles(newFiles));
  },

  render() {
    const { fastas, filterActive, loading, location } = this.props;
    return (
      <FileDragAndDrop onFiles={this.upload}>
        { loading && <div ref="loadingBar" className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>}
        { fastas.length ?
            <div className="wgsa-hub">
              <Summary pathname={location && location.pathname} />
              { React.cloneElement(this.props.children, { items: fastas }) }
            </div> :
            <div className="wgsa-hub-welcome-container">
              <p className="wgsa-hub-welcome">
                { filterActive ?
                    'Nothing to show...' :
                    'Drag and drop files to begin.'
                }
              </p>
            </div>
        }
        <Filter filterActive={filterActive} />
      </FileDragAndDrop>
    );
  },

});
