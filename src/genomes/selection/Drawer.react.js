import React from 'react';
import { connect } from 'react-redux';

import Drawer from '../../drawer';
import { GenomeArchiveButton } from '../../downloads';
import CreateCollectionForm from '../create-collection-form';
import Stats from '../stats';

import { getSelectedGenomeIds, getSelectedGenomeList } from './selectors';

import { setSelection, unselectGenomes } from './actions';

import config from '../../app/config';

const { maxArchiveSize = 100 } = config;

function getSelectionTitle(selectedGenomes) {
  return (
    <span>
      <span className="wgsa-genome-total">{selectedGenomes.length}</span>&nbsp;
      {` Genome${selectedGenomes.length === 1 ? '' : 's'} Selected`}
    </span>
  );
}

const SelectionDrawer = React.createClass({

  componentDidMount() {
    this.upgradeElements();
  },

  componentDidUpdate() {
    this.upgradeElements();
  },

  getDownloadTitle() {
    if (this.props.disableDownload) {
      return `A single archive cannot contain more than ${maxArchiveSize} genomes at this time.`;
    }
    return 'Download Selection';
  },

  upgradeElements() {
    if (this.tabs) {
      componentHandler.upgradeElement(this.tabs);
    }
  },

  render() {
    const { selectedGenomes, removeGenome, disableDownload } = this.props;
    return (
      <Drawer
        title={getSelectionTitle(selectedGenomes)}
        visible={selectedGenomes.length > 0}
      >
        <div ref={el => { this.tabs = el; }} className="wgsa-selection-tabs mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
          <div className="mdl-tabs__tab-bar mdl-tabs__tab-bar--start">
            <a href="#create-collection-panel" className="mdl-tabs__tab is-active">Create Collection</a>
            <a href="#selection-panel" className="mdl-tabs__tab">Selection</a>
            <a href="#stats-panel" className="mdl-tabs__tab">Stats</a>
            <div className="wgsa-tab-actions">
              <GenomeArchiveButton
                ids={this.props.selectedGenomeIds}
                filename="wgsa-genome-selection"
                title={this.getDownloadTitle()}
                disabled={disableDownload}
              />
            </div>
          </div>
          <div className="mdl-tabs__panel is-active" id="create-collection-panel">
            <CreateCollectionForm />
          </div>
          <div className="mdl-tabs__panel" id="selection-panel">
            { selectedGenomes.map(genome =>
                <span key={genome.id} className="mdl-chip mdl-chip--deletable wgsa-inline-chip">
                  <span className="mdl-chip__text">{genome.name}</span>
                  <button
                    type="button"
                    title="Remove genome"
                    className="mdl-chip__action"
                    onClick={() => removeGenome(genome)}
                  >
                    <i className="material-icons">remove_circle_outline</i>
                  </button>
                </span>
            )}
          </div>
          <div className="mdl-tabs__panel is-active" id="stats-panel">
            <Stats />
          </div>
        </div>
      </Drawer>
    );
  },

});

function mapStateToProps(state) {
  const selectedGenomes = getSelectedGenomeList(state);
  return {
    selectedGenomes,
    selectedGenomeIds: getSelectedGenomeIds(state),
    disableDownload: selectedGenomes.length > maxArchiveSize,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearSelection: () => dispatch(setSelection([])),
    removeGenome: genome => dispatch(unselectGenomes([ genome ])),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectionDrawer);
