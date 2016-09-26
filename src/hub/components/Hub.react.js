import React from 'react';

import ProgressBar from '../../components/ProgressBar.react';
import FileDragAndDrop from '../../components/upload/DragAndDrop.react';

import Header from './Header.react';
import Filter from './Filter.react';

import { updateHeader } from '^/actions/header';
import { uploadFasta, addFiles } from '../thunks';

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
    const { fastas, dispatch } = this.props;
    dispatch(
      updateHeader({
        classNames: `wgsa-hub-header ${fastas.length ? 'wgsa-hub--has-aside' : ''}`.trim(),
        content: <Header />,
      })
    );
    document.title = 'WGSA | Upload';
  },

  componentDidUpdate() {
    const { uploads, loading, collection, dispatch } = this.props;
    const { queue, uploading } = uploads;

    if (queue.length && uploading.size < 5) {
      dispatch(uploadFasta(queue[0]));
    }

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

  upload(newFiles) {
    const { dispatch } = this.props;
    dispatch(addFiles(newFiles));
    dispatch(updateHeader({
      classNames: 'wgsa-hub-header wgsa-hub--has-aside',
    }));
  },

  render() {
    const { fastas, totalFastas, filterActive, loading, uploads } = this.props;
    const { queue } = uploads;

    return (
      <FileDragAndDrop onFiles={this.upload}>
        { loading && <div ref="loadingBar" className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>}
        { fastas.length ?
            <div className="wgsa-hub">
              <div className="wgsa-hub-summary">
                { queue.length ?
                    <ProgressBar
                      className="wgsa-hub-upload-progress"
                      progress={(1 - (queue.length / fastas.length)) * 100}
                    /> :
                    <p>Viewing <span>{fastas.length}</span> of {totalFastas} assemblies</p>
                }
              </div>
              { React.cloneElement(this.props.children, { items: fastas }) }
            </div> :
            <div className="welcome-container">
              <p className="welcome-intro">
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
