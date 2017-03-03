import React from 'react';
import { connect } from 'react-redux';

import Drawer from '../../drawer';
import CreateCollectionForm from '../create-collection-form';

import { getSelectedGenomeList } from './selectors';

import { setSelection, unselectGenomes } from './actions';

function getSelectionTitle(selectedGenomes) {
  return (
    <span>
      <span className="wgsa-genome-total">{selectedGenomes.length}</span>&nbsp;
      {` Genome${selectedGenomes.length === 1 ? '' : 's'} selected`}
    </span>
  );
}

const SelectionDrawer = React.createClass({

  componentDidUpdate() {
    if (this.tabs) {
      componentHandler.upgradeElement(this.tabs);
    }
    if (this.menu) {
      componentHandler.upgradeElement(this.menu);
    }
  },

  render() {
    const { selectedGenomes, removeGenome, clearSelection } = this.props;
    return (
      <Drawer
        title={getSelectionTitle(selectedGenomes)}
        visible={selectedGenomes.length > 0}
      >
        <div ref={el => { this.tabs = el; }} className="wgsa-selection-tabs mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
          <div className="mdl-tabs__tab-bar mdl-tabs__tab-bar--start">
            <a href="#create-collection-panel" className="mdl-tabs__tab is-active">Create Collection</a>
            <a href="#selection-panel" className="mdl-tabs__tab">Selection</a>
            <div className="wgsa-tab-actions">
              <button
                id="selection-drawer-actions"
                className="mdl-button mdl-js-button mdl-button--icon"
              >
                <i className="material-icons">more_vert</i>
              </button>
              <ul
                ref={el => { this.menu = el; }}
                className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"
                htmlFor="selection-drawer-actions"
              >
                <li className="mdl-menu__item" onClick={clearSelection}>Download</li>
                <li className="mdl-menu__item" onClick={clearSelection}>Clear All</li>
              </ul>
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
        </div>
      </Drawer>
    );
  },

});

function mapStateToProps(state) {
  return {
    selectedGenomes: getSelectedGenomeList(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearSelection: () => dispatch(setSelection([])),
    removeGenome: genome => dispatch(unselectGenomes([ genome ])),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectionDrawer);
