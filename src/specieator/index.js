import './style.css';

import React from 'react';
import { connect } from 'react-redux';

import FileDragAndDrop from '../components/upload/DragAndDrop.react';
import Overview from './Overview.react';
import FileGrid from './FileGrid.react';
import Filter from './Filter.react';

import { updateHeader } from '^/actions/header';
import { uploadFasta } from './actions';

import { addFiles, sendToServer } from './utils';
import { taxIdMap } from '^/species';

const Specieator = React.createClass({

  propTypes: {
    fastas: React.PropTypes.object.isRequired,
    order: React.PropTypes.array.isRequired,
    uploads: React.PropTypes.object,
    dispatch: React.PropTypes.func.isRequired,
  },

  contextTypes: {
    router: React.PropTypes.object,
  },

  componentWillMount() {
    this.props.dispatch(
      updateHeader({
        speciesName: 'Specieator',
        classNames: 'wgsa-specieator-header',
        content: (
          <span className="mdl-layout-spacer mdl-layout-spacer--flex">
            <div className="mdl-layout-spacer" />
            <nav className="mdl-navigation">
              <a className="mdl-navigation__link mdl-navigation__link--active" href="">Specieator</a>
              <a className="mdl-navigation__link" href="">Downloads</a>
              <a className="mdl-navigation__link" href="">Documentation</a>
            </nav>
          </span>
        ),
      })
    );
  },

  componentDidUpdate() {
    const { uploads, fastas, loading, collection, dispatch } = this.props;

    const { queue, uploading } = uploads;
    if (queue.length && uploading.size < 5) {
      const { name, file } = fastas[queue[0]];
      dispatch(uploadFasta(name, sendToServer(file, dispatch)));
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
    const { dispatch, fastas } = this.props;
    addFiles(newFiles, fastas, dispatch);
    dispatch(updateHeader({ classNames: 'wgsa-specieator-header wgsa-specieator--has-aside' }));
  },

  countSpecies(fastas) {
    return fastas.reduce((memo, { speciesId }) => {
      if (!speciesId) return memo;
      return {
        ...memo,
        [speciesId]: (memo[speciesId] || 0) + 1,
      };
    }, {});
  },

  render() {
    const { fastas, order, loading } = this.props;

    const orderedFastas = order.map(name => fastas[name]);

    return (
      <FileDragAndDrop onFiles={this.upload}>
        { loading && <div ref="loadingBar" className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>}
        { order.length ?
            <FileGrid files={orderedFastas} /> :
            <Overview />
        }
        <Filter speciesSummary={this.countSpecies(orderedFastas)} />
      </FileDragAndDrop>
    );
  },

});


function mapStateToProps({ specieator, entities, collection }) {
  return {
    fastas: entities.fastas,
    order: specieator.fastaOrder,
    uploads: specieator.uploads,
    loading: specieator.loading,
    collection,
  };
}

export default connect(mapStateToProps)(Specieator);
