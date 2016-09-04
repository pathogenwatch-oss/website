import './style.css';

import React from 'react';
import { connect } from 'react-redux';

import FileDragAndDrop from '../components/upload/DragAndDrop.react';
import FileGrid from './FileGrid.react';
import Filter from './Filter.react';

import { updateHeader } from '^/actions/header';
import { uploadFasta, addFiles } from './thunks';

import { getVisibleFastas, getTotalFastas, isFilterActive } from './reducers';

import { taxIdMap } from '^/species';

const Specieator = React.createClass({

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
        speciesName: 'Specieator',
        classNames: `wgsa-specieator-header ${fastas.length ? 'wgsa-specieator--has-aside' : ''}`.trim(),
        content: (
          <span className="mdl-layout-spacer mdl-layout-spacer--flex">
            <div className="mdl-layout-spacer" />
            <nav className="mdl-navigation">
              <a className="mdl-navigation__link mdl-navigation__link--active" href="">Upload</a>
              <a className="mdl-navigation__link" href="">Downloads</a>
              <a className="mdl-navigation__link" href="">Documentation</a>
            </nav>
          </span>
        ),
      })
    );
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
    dispatch(updateHeader({ classNames: 'wgsa-specieator-header wgsa-specieator--has-aside' }));
  },

  countSpecies(fastas) {
    const summary =
      fastas.reduce((memo, { speciesId }) => {
        if (!speciesId) return memo;
        return {
          ...memo,
          [speciesId]: (memo[speciesId] || 0) + 1,
        };
      }, {});

    return (
      Object.keys(summary).map(speciesId => ({
        speciesId,
        count: summary[speciesId],
      }))
    );
  },

  render() {
    const { fastas, totalFastas, filterActive, loading } = this.props;

    return (
      <FileDragAndDrop onFiles={this.upload}>
        { loading && <div ref="loadingBar" className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>}
        { fastas.length ?
            <FileGrid total={totalFastas} files={fastas} /> :
            <div className="welcome-container">
              <p className="welcome-intro">
                { filterActive ?
                    'Nothing to show...' :
                    'Drag and drop files to begin.'
                }
              </p>
            </div>
        }
        <Filter
          speciesSummary={this.countSpecies(fastas)}
          filterActive={filterActive}
        />
      </FileDragAndDrop>
    );
  },

});


function mapStateToProps(state) {
  const { specieator, collection } = state;
  return {
    totalFastas: getTotalFastas(state),
    fastas: getVisibleFastas(state),
    filterActive: isFilterActive(state),
    uploads: specieator.uploads,
    loading: specieator.loading,
    collection,
  };
}

export default connect(mapStateToProps)(Specieator);
